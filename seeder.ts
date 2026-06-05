// import mongoose from 'mongoose';
// import Product from './src/models/Product';
// import Category from './src/models/Category';
// import Cart from './src/models/Cart';
// import Order from './src/models/Order';
// import User from './src/models/User';
//
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
//
// const seedData = async () => {
//     try {
//         console.log('⏳ Connecting to Database...');
//         await mongoose.connect(MONGO_URI);
//         console.log('✅ Connected.');
//         console.log('🧹 Clearing old data...');
//         await Product.deleteMany({});
//         await Category.deleteMany({});
//         await Cart.deleteMany({});
//         await Order.deleteMany({});
//         await User.deleteMany({});
//         console.log('✅ Collections cleared.');
//
//         // ==========================================
//         // 1. User
//         // ==========================================
//         console.log('👤 Seeding Test User...');
//         await User.create({
//             _id: '6a2067306e9b71d67f2e9783',
//             email: 'krasno0@gmail.com',
//             passwordHash: '$2b$10$3opRRNIagyOZGJuxHPrWl.IzPmUUYqtSGzZdu5YgPsSgJliHjjdyy',
//             role: 'user'
//         });
//         console.log('✅ User seeded.');
//
//         // ==========================================
//         // 2. Categories
//         // ==========================================
//         console.log('📦 Seeding Categories...');
//         const electronicsId = '6a1d5857b837bebe6f7bee9c';
//         await Category.create({
//             _id: electronicsId,
//             name: 'Electronics',
//             slug: 'electronics',
//             images: ['/uploads/electronics.jpeg']
//         });
//
//         const shoesId = '6a1d5857b837bebe6f7be001';
//         await Category.create({
//             _id: shoesId,
//             name: 'Beauty',
//             slug: 'beauty',
//             images: ['/uploads/beauty.jpeg']
//         });
//         console.log('✅ Categories seeded.');
//
//         // ==========================================
//         // 3.products
//         // ==========================================
//         console.log('📱 Seeding Products...');
//         const products = [
//             {
//                 _id: '6a182983495d81e8107687e4',
//                 title: 'iPhone 15 Pro',
//                 description: 'Apple flagship compact smartphone with titanium design and professional camera system.',
//                 price: 999,
//                 category: electronicsId,
//                 stock: 25,
//                 features: { color: 'Natural Titanium', storage: '256GB' },
//                 images: ['https://placehold.co/600x450?text=iPhone+15+Pro']
//             },
//             {
//                 _id: '6a1834b18db94dd914cd7a14',
//                 title: 'iPhone 17 Pro',
//                 description: 'Apple flagship smartphone 2026 with an entirely new design language, under-display FaceID and A20 chip.',
//                 price: 1299,
//                 category: electronicsId,
//                 stock: 15,
//                 features: { color: 'Orange', storage: '256GB' },
//                 images: ['https://placehold.co/600x450?text=iPhone+17+Pro']
//             },
//             {
//                 _id: '6a1976b2c56009ea35fdf9d2',
//                 title: 'Samsung s26 Ultra',
//                 description: 'Samsung flagship smartphone 2026. Equipped with Galaxy AI 2.0, 200MP camera, and built-in S-Pen.',
//                 price: 1499,
//                 category: electronicsId,
//                 stock: 15,
//                 features: { color: 'Black', storage: '256GB' },
//                 images: ['https://placehold.co/600x450?text=Samsung+S26+Ultra']
//             },
//             {
//                 _id: '6a1988fee8ef8f978424e0d9',
//                 title: 'Samsung s26',
//                 description: 'Samsung compact flagship smartphone 2026. Perfect size, ultimate performance.',
//                 price: 999,
//                 category: electronicsId,
//                 stock: 10,
//                 features: { color: 'Black', storage: '256GB' },
//                 images: ['https://placehold.co/600x450?text=Samsung+S26']
//             },
//             {
//                 _id: '6a19add9cbe5cccfea4852a2',
//                 title: 'Samsung s26 plus',
//                 description: 'Samsung smartphone 2026. Bigger screen, massive battery life, premium glass finish.',
//                 price: 1199,
//                 category: electronicsId,
//                 stock: 10,
//                 features: { color: 'Black', storage: '256GB' },
//                 images: ['https://placehold.co/600x450?text=Samsung+S26+Plus']
//             },
//             {
//                 _id: '6a1eacc45932789f87ac3873',
//                 title: 'Samsung galaxy s25',
//                 description: 'Samsung compact smartphone 2025. Reliable, fast, and now fully integrated with AI features.',
//                 price: 799,
//                 category: electronicsId,
//                 stock: 10,
//                 features: { color: 'White', storage: '256GB' },
//                 images: ['https://placehold.co/600x450?text=Samsung+S25']
//             },
//             {
//                 _id: '6a1eacfb5932789f87ac3874',
//                 title: 'Google pixel 10',
//                 description: 'Google compact smartphone 2025. The purest Android experience with industry-leading computational photography.',
//                 price: 799,
//                 category: electronicsId,
//                 stock: 10,
//                 features: { color: 'White', storage: '256GB' },
//                 images: ['https://placehold.co/600x450?text=Google+Pixel+10']
//             },
//             {
//                 _id: '6a1eb2d8b0f4353cc6813c87',
//                 title: 'OnePlus 15',
//                 description: 'Flagmanship 1+15 2026. Never Settle performance with 150W ultra-fast charging.',
//                 price: 999,
//                 category: electronicsId,
//                 stock: 2,
//                 features: { color: 'Green', storage: '512GB' },
//                 images: ['/uploads/image-1780396760365-270209188.webp']
//             },
//             {
//                 _id: '6a1eb2d8b0f4353cc6813c99',
//                 title: 'Retro Sneakers V2',
//                 description: 'Comfortable retro lifestyle sneakers for everyday use.',
//                 price: 120,
//                 category: shoesId,
//                 stock: 50,
//                 features: { size: '42', color: 'White/Blue' },
//                 images: ['https://placehold.co/600x450?text=Retro+Sneakers']
//             }
//         ];
//
//         await Product.insertMany(products);
//         console.log('✅ Products seeded successfully!');
//
//     } catch (error) {
//         console.error('❌ Error seeding data:', error);
//     } finally {
//         await mongoose.connection.close();
//         console.log('🔌 Database connection closed.');
//         process.exit(0);
//     }
// };
//
// seedData();