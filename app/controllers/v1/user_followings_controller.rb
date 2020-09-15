class V1::UserFollowingsController < ApplicationController
  # before_action :authenticate

  def show
    user_followings = UserFollowing.where(user_id: params[:id])
    user_ids = []
    user_followings.each { |u_f| user_ids << u_f.following_user_id }
    users = []
    user_ids.each { |u_i| users <<  User.find(u_i) }
    render json: users, status: :ok
  end

  def create
    if UserFollowing.where(user_id: params[:user_id]).where(
         following_user_id: params[:following_user_id]
       ).presents?
      render json: user_following,
             message: 'Already Following',
             status: :unprocessable_entity
    end

    user_following = UserFollowing.new(params[:user_following])

    if user_following.save
      render json: user_following, message: 'Success', status: :success
    else
      render json: { error: user_following.errors.messages }, status: 422
    end
  end

  def destroy
    user_following =
      UserFollowing.where(user_id: params[:user_id]).where(
        following_user_id: params[:following_user_id]
      )

    if user_following.destroy
      render json: { message: 'Success' }, status: :ok
    else
      render json: { error: user_following.errors.messages }, status: 422
    end
  end

  private

  def following_param
    params.require(:user_following).permit(:user_id, :following_user_id)
  end

  def authenticate
    token = request.headers['token'].delete_suffix('nil')
    user = User.where(authentication_token: token)
    if user.empty? || user.ids.first != params[:user_id]
      render json: 'unauthorized', status: :unauthorized
    end
  end
end
