README 

# 1. Install semua dependency
npm install

# 2. Inisialisasi Sequelize 
npx sequelize-cli init


# Menjalankan semua migrasi ke database
npx sequelize-cli db:migrate

# Undo semua migrasi (rollback)
npx sequelize-cli db:migrate:undo:all

# Menjalankan semua seeder
npx sequelize-cli db:seed:all

# Menjalankan backend dengan nodemon
nodemon start




