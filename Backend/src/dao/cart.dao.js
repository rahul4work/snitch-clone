import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";

export async function getCartDetails(userId) {
  let cart = (
    await cartModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $unwind: {
          path: "$items",
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "items.product",
        },
      },

      {
        $unwind: {
          path: "$items.product",
        },
      },

      {
        $set: {
          selectedVariant: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$items.product.variants",
                  as: "variant",
                  cond: {
                    $eq: ["$$variant._id", "$items.variant"],
                  },
                },
              },
              0,
            ],
          },
        },
      },

      {
        $set: {
          variantImage: {
            $let: {
              vars: {
                sameColourVariants: {
                  $filter: {
                    input: "$items.product.variants",
                    as: "variant",
                    cond: {
                      $and: [
                        {
                          $eq: [
                            "$$variant.attributes.Colour",
                            "$selectedVariant.attributes.Colour",
                          ],
                        },
                        {
                          $gt: [
                            { $size: { $ifNull: ["$$variant.images", []] } },
                            0,
                          ],
                        },
                      ],
                    },
                  },
                },
              },
              in: {
                $arrayElemAt: ["$$sameColourVariants.images", 0],
              },
            },
          },
        },
      },

      {
        $set: {
          itemPrice: {
            price: {
              $multiply: ["$items.quantity", "$selectedVariant.price.amount"],
            },
            currency: "$selectedVariant.price.currency",
          },

          "items.image": "$variantImage",

          "items.selectedVariant": "$selectedVariant",
        },
      },

      {
        $group: {
          _id: "$_id",

          user: {
            $first: "$user",
          },

          totalPrice: {
            $sum: "$itemPrice.price",
          },

          currency: {
            $first: "$itemPrice.currency",
          },

          items: {
            $push: "$items",
          },
        },
      },
    ])
  )[0];

  return cart;
}
