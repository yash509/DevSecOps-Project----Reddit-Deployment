import React, { useEffect, useState } from "react";
import { Stack } from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import { Community } from "../../atoms/communitiesAtom";
import { firestore } from "../../firebase/clientApp";
import PostLoader from "./Loader";
import { Post, postState, PostVote } from "../../atoms/postsAtom";
import PostItem from "./PostItem";
import { useRouter } from "next/router";
import usePosts from "../../hooks/usePosts";
type PostsProps = {
  communityData?: Community;
  userId?: string;
  loadingUser: boolean;
};
const Posts: React.FC<PostsProps> = ({
  communityData,
  userId,
  loadingUser,
}) => {
  const [loading, setLoading] = useState(false);
  // const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  const { postStateValue, setPostStateValue, onVote, onDeletePost } = usePosts(
    communityData!
  );
  const onSelectPost = (post: Post, postIdx: number) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/r/${communityData?.id!}/comments/${post.id}`);
  };
  useEffect(() => {
    if (
      postStateValue.postsCache[communityData?.id!] &&
      !postStateValue.postUpdateRequired
    ) {
      setPostStateValue((prev) => ({
        ...prev,
        posts: postStateValue.postsCache[communityData?.id!],
      }));
      return;
    }
    getPosts();
  }, [communityData, postStateValue.postUpdateRequired]);
  const getPosts = async () => {
    console.log("WE ARE GETTING POSTS!!!");
    setLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData?.id!),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
        postsCache: {
          ...prev.postsCache,
          [communityData?.id!]: posts as Post[],
        },
        postUpdateRequired: false,
      }));
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };
  console.log("HERE IS POST STATE", postStateValue);
  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post: Post, index) => (
            <PostItem
              key={post.id}
              post={post}
              // postIdx={index}
              onVote={onVote}
              onDeletePost={onDeletePost}
              userVoteValue={
                postStateValue.postVotes.find((item) => item.postId === post.id)
                  ?.voteValue
              }
              userIsCreator={userId === post.creatorId}
              onSelectPost={onSelectPost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
