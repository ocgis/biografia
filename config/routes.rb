Biografia::Application.routes.draw do

  match 'auth/:provider/callback', to: 'sessions#create', via: [:get, :post]
  match 'auth/failure', to: redirect('/'), via: [:get, :post]
  match 'signout', to: 'sessions#destroy', as: 'signout', via: [:get, :post]

  resources :addresses, :except => [:create, :destroy] do
    collection do
      post 'createp'
      get 'newp'
    end
    
    member do
      get 'showp'
    end
  end
  
  resources :event_dates, :except => [:create, :new, :destroy] do
    collection do
      post 'createp'
      get 'newp'
    end
    
    member do
      get 'showp'
    end
  end
  
  resources :events, :except => [:create, :destroy] do
    collection do
      post 'createp'
      get 'newp'
    end
    
    member do
      get 'showp'
    end
  end

  resources :imports, :only => [:new]

  resources :media, :except => [:destroy, :update] do
    collection do
      get 'register'
      get 'search'
    end
    
    member do
      get 'showp'
    end
  end

  resources :notes, :except => [:create, :new, :destroy] do
    collection do
      post 'createp'
      get 'newp'
    end
    
    member do
      get 'showp'
    end
  end

  resources :people do
    collection do
      post 'createp'
      get 'newp'
    end
    
    member do
      get 'ancestry'
      get 'showp'
    end
  end
  
  get  "references/connection_add"
  post "references/connection_add"
  get  "references/connection_choose"
  post "references/connection_list"
  get  "references/delete"
  get  "references/destroy"

  resources :relationships, :except => [:create, :new, :destroy] do
    collection do
      post 'createp'
      get 'newp'
    end
    
    member do
      get 'showp'
    end
  end

  resources :sessions, :only => [:new]
  resources :transfers, :only => [:create, :new, :show]
  resources :users, :only => [:index, :show, :edit, :update]  

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

  root :to => "public#home"
end
