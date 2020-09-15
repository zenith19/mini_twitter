class V1::UserFollowersController < ApplicationController
  def show
    user_followers = UserFollowing.where(following_user_id: params[:id])
    user_ids = []
    user_followers.each { |u_f| user_ids << u_f.user_id }
    users = []
    user_ids.each { |u_i| users << User.find(u_i) }
    render json: users, status: :ok
  end
end
