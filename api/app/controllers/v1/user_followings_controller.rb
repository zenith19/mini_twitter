module V1
  class UserFollowingsController < ApplicationController
    before_action :authenticate_user!, except: :show

    # GET /v1/users/:user_id/followings
    # Previously collected ids in a Ruby loop and called User.find on each
    # one; now a single query through the association.
    def show
      user = User.find(params[:user_id])
      users = paginate(user.followings.order(:id))
      render json: users, meta: pagination_meta(users), scope: current_user, status: :ok
    end

    # POST /v1/follows
    def create
      follow = current_user.active_follows.build(following_user_id: params[:following_user_id])

      if follow.save
        render json: follow, status: :created
      else
        unprocessable(follow)
      end
    end

    # DELETE /v1/follows/:id
    # The old version called .destroy on an ActiveRecord::Relation, which
    # raises rather than deleting anything.
    def destroy
      follow = current_user.active_follows.find_by!(following_user_id: params[:id])
      follow.destroy!
      head :no_content
    end
  end
end
