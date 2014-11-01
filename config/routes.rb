Biografia::Application.routes.draw do

  match 'auth/:provider/callback', to: 'sessions#create', via: [:get, :post]
  match 'auth/failure', to: redirect('/'), via: [:get, :post]
  match 'signout', to: 'sessions#destroy', as: 'signout', via: [:get, :post]

  resources :addresses do
    collection do
      post 'createp'
      get 'newp'
    end

    member do
      get 'delete'
    end
  end
  
  resources :event_dates, :except => [:create, :new] do
    collection do
      post 'createp'
      get 'newp'
    end

    member do
      get 'delete'
    end
  end
  
  resources :events do
    collection do
      post 'createp'
      get 'newp'
    end

    member do
      get 'delete'
    end
  end

  resources :exports, :only => [:index, :new, :create, :show] do
    member do
      get 'status'
    end
  end

  resources :imports, :only => [:new]

  resources :media, :except => [:destroy, :update] do
    collection do
      get 'register'
      get 'search'
    end
    
    member do
      get 'delete'
      get 'showp'
    end
  end

  resources :notes, :except => [:create, :new] do
    collection do
      post 'createp'
      get 'newp'
    end

    member do
      get 'delete'
    end
  end

  resources :people do
    collection do
      post 'createp'
      get 'newp'
    end
    
    member do
      get 'ancestry'
      get 'delete'
    end
  end
  
  resources :references, :only => [:destroy] do
    collection do
      get  "connection_add"
      post "connection_add"
      get  "connection_choose"
      post "connection_list"
    end
    
    member do
      get  "delete"
    end
  end

  resources :relationships, :except => [:create, :new] do
    collection do
      post 'createp'
      get 'newp'
    end

    member do
      get 'delete'
    end
  end

  resources :sessions, :only => [:new]
  resources :transfers, :only => [:create, :new, :index, :show]
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
