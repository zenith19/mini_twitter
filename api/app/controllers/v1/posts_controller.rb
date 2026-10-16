module V1
  class PostsController < ApplicationController
    before_action :authenticate_user!, except: %i[index show]

    # GET /v1/posts
    def index
      posts = paginate(Post.newest_first.includes(:user))
      render json: posts, meta: pagination_meta(posts), status: :ok
    end

    # GET /v1/posts/:id
    def show
      render json: Post.includes(:user).find(params[:id]), status: :ok
    end

    # POST /v1/posts
    def create
      # The author is taken from the token, never from the request body, so a
      # client cannot post as somebody else.
      post = current_user.posts.build(post_params)

      if post.save
        render json: post, status: :created
      else
        unprocessable(post)
      end
    end

    # PATCH/PUT /v1/posts/:id
    def update
      # Scoping through the association means a non-owner gets a 404 by
      # construction rather than relying on a separate ownership check.
      post = current_user.posts.find(params[:id])

      if post.update(post_params)
        render json: post, status: :ok
      else
        unprocessable(post)
      end
    end

    # DELETE /v1/posts/:id
    def destroy
      current_user.posts.find(params[:id]).destroy!
      head :no_content
    end

    private

    def post_params
      params.require(:post).permit(:title, :content)
    end
  end
end
