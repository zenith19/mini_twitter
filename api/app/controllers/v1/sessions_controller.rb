class V1::SessionsController < ApplicationController
  before_action :authenticate, only: :destroy
  def create
    user = User.where(email: params[:email]).first

    if user.present? && user.valid_password?(params[:password])
      render json: user.to_json(only: %i[id email authentication_token]),
             status: 201
    else
      render json: { message: 'Invalid Email or Password' }
    end
  end

  def destroy
    user = User.find(params[:id])
    token = request.headers['token'].delete_suffix('nil')

    if user.present? && user.authentication_token == token
      user.authentication_token = nil
      user.save
      render json: { message: 'successfully logout' }
    else
      render json: { message: 'Invalid Session' }
    end
  end

  private

  def authenticate
    token = request.headers['token'].delete_suffix('nil')
    user = User.where(authentication_token: token)
    if user.empty?
      render json: 'unauthorized', status: :unauthorized
    end
  end
end
