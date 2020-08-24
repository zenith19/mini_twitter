Rails.application.routes.draw do
  namespace :v1 do
    get 'user_followings/index'
  end
  get 'user_followings/index'
  # devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :v1, defaults: {format: :json} do
  	resources :posts
  	resources :sessions, only: [:create, :destroy]
  	resources :users, only: [:create]
  	resources :comments
  	resources :user_followings, only: [:show, :create, :destroy]
  end
end
