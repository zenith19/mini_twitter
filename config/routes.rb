Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :v1 do
  	resources :users, only: [:index]
  	resources :posts, only: [:index]
  	resources :comments, only: [:index]
  	resources :authentications, only: [:show]
  end
end
