import React, { useState } from "react";
type PostsHomeProps = {};
const PostsHome: React.FC<PostsHomeProps> = () => {
  const [loading, setLoading] = useState(false);
  return <div>Home Posts Wrapper</div>;
};
export default PostsHome;
