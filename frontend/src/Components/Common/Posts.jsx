import Post from "./Post";
import PostSkeleton from "../Skeletons/PostSkeleton";

import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react";

const Posts = ({ feedType }) => {
	const getEndPoint = ()=>{
		switch (feedType) {
			case "forYou":
				return "/api/post/all"
			case "following":
				return "/api/post/following"
			default :
				return "/api/post/all"
		}
	}

	const post_EndPoint = getEndPoint()

	const {data: posts , isLoading , refetch , isRefetching} = useQuery({
		queryKey: ["posts"],
		queryFn: async ()=>{
			try {
				const res = await fetch(post_EndPoint)
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error || "Can not find posts")
			}

			return data
			} catch (error) {
				throw new Error(error)
			}
		}
	})

	useEffect(()=>{
		refetch()
	} , [refetch , feedType])

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;