import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectUserDB from "../configs/db/db.config.js";
import User from "../models/user/user.model.js";
import Post from "../models/post/post.model.js";
import Like from "../models/like/like.model.js";
import Comment from "../models/comment/comment.model.js";

const SEED_EMAIL_PREFIX = "contest-seed-";

const seedPassword = await bcrypt.hash(
  "Seed@123",
  10
);

const createPost = ({
  creator,
  category,
  likesCount,
  commentsCount,
  viewsCount,
  createdAt,
  caption,
}) => {
  return {
    creator,
    media: "uploads/images/seed-placeholder.jpg",
    caption,
    category,
    likesCount,
    commentsCount,
    viewsCount,
    createdAt,
    updatedAt: createdAt,
  };
};

const seedContestData = async () => {
  try {
    await connectUserDB();

    console.log("Connected to MongoDB");

    const existingSeedUsers = await User.find({
      email: {
        $regex: `^${SEED_EMAIL_PREFIX}`,
      },
    }).select("_id");

    const existingSeedUserIds = existingSeedUsers.map(
      (user) => user._id
    );

    if (existingSeedUserIds.length) {
      const existingSeedPosts = await Post.find({
        creator: {
          $in: existingSeedUserIds,
        },
      }).select("_id");

      const existingPostIds = existingSeedPosts.map(
        (post) => post._id
      );

      if (existingPostIds.length) {
        await Like.deleteMany({
          post: {
            $in: existingPostIds,
          },
        });

        await Comment.deleteMany({
          post: {
            $in: existingPostIds,
          },
        });

        await Post.deleteMany({
          _id: {
            $in: existingPostIds,
          },
        });
      }

      await User.deleteMany({
        _id: {
          $in: existingSeedUserIds,
        },
      });
    }

    console.log("Previous seed data cleaned");

    const users = await User.create([
      {
        email: `${SEED_EMAIL_PREFIX}multi@example.com`,
        password: seedPassword,
        residency: "Chhattisgarh",
      },
      {
        email: `${SEED_EMAIL_PREFIX}tie-comments@example.com`,
        password: seedPassword,
        residency: "Chhattisgarh",
      },
      {
        email: `${SEED_EMAIL_PREFIX}tie-views@example.com`,
        password: seedPassword,
        residency: "Chhattisgarh",
      },
      {
        email: `${SEED_EMAIL_PREFIX}tie-early@example.com`,
        password: seedPassword,
        residency: "Chhattisgarh",
      },
      {
        email: `${SEED_EMAIL_PREFIX}consistent@example.com`,
        password: seedPassword,
        residency: "Chhattisgarh",
      },
      {
        email: `${SEED_EMAIL_PREFIX}inconsistent@example.com`,
        password: seedPassword,
        residency: "Chhattisgarh",
      },
      {
        email: `${SEED_EMAIL_PREFIX}non-cg@example.com`,
        password: seedPassword,
        residency: "Madhya Pradesh",
      },
      {
        email: `${SEED_EMAIL_PREFIX}photo-only@example.com`,
        password: seedPassword,
        residency: "Chhattisgarh",
      },
      {
        email: `${SEED_EMAIL_PREFIX}cascade-a@example.com`,
        password: seedPassword,
        residency: "Chhattisgarh",
      },
      {
        email: `${SEED_EMAIL_PREFIX}cascade-b@example.com`,
        password: seedPassword,
        residency: "Chhattisgarh",
      },
      {
        email: `${SEED_EMAIL_PREFIX}cascade-c@example.com`,
        password: seedPassword,
        residency: "Chhattisgarh",
      },
    ]);

    const [
      multiCategoryUser,
      tieCommentsUser,
      tieViewsUser,
      tieEarlyUser,
      consistentUser,
      inconsistentUser,
      nonCgUser,
      photoOnlyUser,
      cascadeA,
      cascadeB,
      cascadeC,
    ] = users;

    const week1 = new Date("2026-09-01T10:00:00.000Z");
    const week2 = new Date("2026-09-08T10:00:00.000Z");
    const week3 = new Date("2026-09-15T10:00:00.000Z");
    const week4 = new Date("2026-09-22T10:00:00.000Z");

    const posts = [];

    posts.push(
      createPost({
        creator: multiCategoryUser._id,
        category: "dance",
        likesCount: 800,
        commentsCount: 100,
        viewsCount: 1000,
        createdAt: week1,
        caption: "Multi category leader - Dance",
      }),

      createPost({
        creator: multiCategoryUser._id,
        category: "music",
        likesCount: 750,
        commentsCount: 90,
        viewsCount: 1000,
        createdAt: week1,
        caption: "Multi category leader - Music",
      })
    );

    posts.push(
      createPost({
        creator: tieCommentsUser._id,
        category: "comedy",
        likesCount: 100,
        commentsCount: 20,
        viewsCount: 200,
        createdAt: new Date(
          "2026-09-02T10:00:00.000Z"
        ),
        caption: "Tie test - higher comments",
      }),

      createPost({
        creator: tieViewsUser._id,
        category: "comedy",
        likesCount: 100,
        commentsCount: 10,
        viewsCount: 350,
        createdAt: new Date(
          "2026-09-02T11:00:00.000Z"
        ),
        caption: "Tie test - lower comments",
      })
    );

    posts.push(
      createPost({
        creator: tieEarlyUser._id,
        category: "art",
        likesCount: 100,
        commentsCount: 20,
        viewsCount: 200,
        createdAt: new Date(
          "2026-09-03T08:00:00.000Z"
        ),
        caption: "Timestamp tie - earlier",
      }),

      createPost({
        creator: cascadeC._id,
        category: "art",
        likesCount: 100,
        commentsCount: 20,
        viewsCount: 200,
        createdAt: new Date(
          "2026-09-03T09:00:00.000Z"
        ),
        caption: "Timestamp tie - later",
      })
    );

    const consistencyWeeks = [
      week1,
      week2,
      week3,
      week4,
    ];

    consistencyWeeks.forEach(
      (weekDate, weekIndex) => {
        for (
          let index = 1;
          index <= 3;
          index++
        ) {
          posts.push(
            createPost({
              creator: consistentUser._id,
              category: "fitness",
              likesCount:
                200 +
                weekIndex * 20 +
                index * 10,
              commentsCount: 20 + index,
              viewsCount:
                500 + weekIndex * 50,
              createdAt: new Date(
                weekDate.getTime() +
                  index * 60 * 60 * 1000
              ),
              caption: `Consistency eligible - week ${
                weekIndex + 1
              } post ${index}`,
            })
          );
        }
      }
    );

    consistencyWeeks.forEach(
      (weekDate, weekIndex) => {
        const numberOfPosts =
          weekIndex === 3 ? 2 : 3;

        for (
          let index = 1;
          index <= numberOfPosts;
          index++
        ) {
          posts.push(
            createPost({
              creator: inconsistentUser._id,
              category: "travel",
              likesCount: 180 + index * 10,
              commentsCount: 15 + index,
              viewsCount: 400,
              createdAt: new Date(
                weekDate.getTime() +
                  index * 60 * 60 * 1000
              ),
              caption: `Consistency fail - week ${
                weekIndex + 1
              } post ${index}`,
            })
          );
        }
      }
    );

    posts.push(
      createPost({
        creator: nonCgUser._id,
        category: "dance",
        likesCount: 10000,
        commentsCount: 5000,
        viewsCount: 50000,
        createdAt: week1,
        caption:
          "Huge score but non Chhattisgarh resident",
      })
    );

    posts.push(
      createPost({
        creator: photoOnlyUser._id,
        category: "photography",
        likesCount: 300,
        commentsCount: 30,
        viewsCount: 1000,
        createdAt: week1,
        caption:
          "Only eligible photography creator",
      })
    );

    posts.push(
      createPost({
        creator: cascadeA._id,
        category: "education",
        likesCount: 600,
        commentsCount: 80,
        viewsCount: 2000,
        createdAt: week1,
        caption: "Cascade candidate A",
      }),

      createPost({
        creator: cascadeB._id,
        category: "education",
        likesCount: 550,
        commentsCount: 70,
        viewsCount: 1800,
        createdAt: week1,
        caption: "Cascade candidate B",
      }),

      createPost({
        creator: cascadeC._id,
        category: "education",
        likesCount: 500,
        commentsCount: 60,
        viewsCount: 1600,
        createdAt: week1,
        caption: "Cascade candidate C",
      })
    );

    await Post.insertMany(posts);

    console.log(`${users.length} seed users created`);
    console.log(`${posts.length} seed posts created`);

    console.log("");
    console.log("Seed scenarios created:");
    console.log(" Multi-category leader");
    console.log(" Tie score");
    console.log(" Timestamp tie-break");
    console.log(" Consistency eligible user");
    console.log(" Missing consistency by one week");
    console.log(" Non-Chhattisgarh high-score user");
    console.log(" Exhausted category");
    console.log(" KYC cascade candidates");

    console.log("");
    console.log(
      "Contest seed completed successfully"
    );

    console.log("");
    console.log("Seed login password: Seed@123");
  } catch (error) {
    console.error(
      "Contest seed failed:",
      error
    );

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedContestData();