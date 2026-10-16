class V1::UsersController < ApplicationController
  def create
    user = User.new(user_params)
    if user.save
      render json: user, status: 201
    else
      render json: :unprocessable_entity, status: 422
    end
  end

  def index
    users = User.all

    render json: users, status: :ok
  end

  def show
    user = User.find(params[:id])

    render json: user, status: :ok
  end

  private

  def user_params
    params.permit(:email, :password, :name, :username)
  end
end
