root = Pathname.new(::Rails.root).realpath.to_s
public = File.join(root, 'public')
transfer = File.join(public, 'transfer')

Biografia::Application.config.transfer_path = transfer
