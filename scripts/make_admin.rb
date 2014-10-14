u = User.find(1)
puts u.inspect
u.roles << :admin
puts u.inspect
u.save
