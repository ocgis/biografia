Biografia::Application.routes.draw do

  post "addresses/createp"
  get  "addresses/edit"
  get  "addresses/index"
  get  "addresses/newp"
  get  "addresses/show"
  get  "addresses/showp"
  post "addresses/update"

  post "event_dates/createp"
  get  "event_dates/edit"
  get  "event_dates/index"
  get  "event_dates/newp"
  get  "event_dates/show"
  get  "event_dates/showp"
  post "event_dates/update"

  post "events/createp"
  get  "events/edit"
  get  "events/index"
  get  "events/newp"
  get  "events/show"
  get  "events/showp"
  post "events/update"

  get  "imports/new"

  post "media/create"
  get  "media/edit"
  get  "media/index"
  get  "media/new"
  get  "media/show"
#  get  "media/showp"

  post "notes/createp"
  get  "notes/edit"
  get  "notes/index"
  get  "notes/newp"
  get  "notes/show"
  get  "notes/showp"
  post "notes/update"

  get  "people/ancestry"
  post "people/create"
  get  "people/destroy"
  get  "people/edit"
  get  "people/index"
  get  "people/new"
  get  "people/show"
  get  "people/showp"
  post "people/update"

  get  "references/connection_add"
  post "references/connection_add"
  get  "references/connection_choose"
  post "references/connection_list"
  get  "references/delete"
  get  "references/destroy"

  post "relationships/createp"
  get  "relationships/edit"
  get  "relationships/index"
  get  "relationships/newp"
  get  "relationships/show"
  get  "relationships/showp"
  post "relationships/update"

  post "transfers/create"
  get  "transfers/new"
  get  "transfers/show"

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  root :to => "people#index"
end
