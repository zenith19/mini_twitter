class V1::UsersController < ApplicationController
  def create
    user = User.new(user_params)
    if user.save
      render json: (user.to_json(only: %i[email name username])),
             status: 201
    else
      render json: :unprocessable_entity, status: 422
    end
  end

  def index
    users = User.all

    render json: users.as_json(only: %i[id name username email]), status: :ok
  end

  def show
    user = User.find(params[:id])

    render json: user.as_json(only: %i[id name username email]), status: :ok
  end

  private

  def user_params
    params.permit(
      :email,
      :password,
      :name,
      :username
    )
  end
end
