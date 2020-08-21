class V1::PostsController < ApplicationController
	def index
		posts = Post.all
		
		render json: posts, status: :ok		
	end

	def show
		post = Post.find(params[:id])

		render json: post, status: :ok
	end

	def create
		post = Post.new(post_param)

		if post.save
			render json: post, message: "Post Created"
		else
			render json: {error: post.errors.messages}, status: 422
		end
	end

	def update
		post = Post.find(params[:id])

		if post.update(post_param)
			render json: post, message: "Post Updated",status: :ok
		else
			render json: {error: post.errors.messages}, status: 422
		end
	end

	def destroy
		post = Post.find(params[:id])

		if post.destroy
			render json: post, message: "Post Deleted",status: :ok
		else
			render json: {error: post.errors.messages}, status: 422
		end
	end

	private
	def post_param
		params.require(:post).permit(:title, 
									 :content,
									 :user_id)
	end
end
