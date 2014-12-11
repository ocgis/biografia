set :application, 'biografia'
set :repo_url, 'git@github.com:ocgis/biografia.git'

set :deploy_to, '/home/rails/biografia'

set :linked_files, %w{config/database.yml config/initializers/facebook.rb}
set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system, protected}

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :publishing, 'deploy:restart'
  after :finishing, 'deploy:cleanup'
end
