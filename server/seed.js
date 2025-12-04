const { sequelize, User, Store, Rating } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    const hashedPassword = await bcrypt.hash('Password@123', 10);

    // 1. Create System Administrator (Must be > 20 chars)
    await User.create({
      name: 'System Administrator User', 
      email: 'admin@test.com',
      password: hashedPassword,
      address: 'Headquarters, Jabalpur',
      role: 'admin'
    });
    console.log('Admin created: admin@test.com');

    // 2. Create a Store Owner
    const owner = await User.create({
      name: 'Amar Agrawal Store Owner',
      email: 'owner@test.com',
      password: hashedPassword,
      address: 'Birsinghpur Market',
      role: 'store_owner'
    });
    console.log('Store Owner created: owner@test.com');

    // 3. Create a Normal User
    const user = await User.create({
      name: 'Rahul Customer Account',
      email: 'user@test.com',
      password: hashedPassword,
      address: 'Civil Lines, Jabalpur',
      role: 'normal_user'
    });
    console.log('User created: user@test.com');

    // 4. Create a Store
    const store = await Store.create({
      name: 'Amar Electronics World',
      address: 'Main Road, Birsinghpur',
      email: 'shop@amar.com',
      ownerId: owner.id
    });
    console.log('Store created: Amar Electronics World');

    // 5. Add a Rating
    await Rating.create({
      userId: user.id,
      storeId: store.id,
      rating: 4
    });
    console.log('Rating added');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();