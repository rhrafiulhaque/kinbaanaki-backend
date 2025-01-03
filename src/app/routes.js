const express = require('express');
const ProductRoutes = require('../module/products/productRoute')
const UsersRoutes = require('../module/users/usersRoute')
const OrderRoutes = require('../module/order/orderRoute')
const CategoryRoutes = require('../module/category/categoryRoute')
const BrandRoutes = require('../module/brand/brandRoute')
const ReviewRoutes = require('../module/reviews/reviewRoute')

const router = express.Router()

const moduleRoutes = [
    {
        path: '/products',
        route: ProductRoutes,
    },
    {
        path: '/user',
        route: UsersRoutes,
    },
    {
        path: '/order',
        route: OrderRoutes,
    },
    {
        path: '/category',
        route: CategoryRoutes,
    },
    {
        path: '/brand',
        route: BrandRoutes,
    },
    {
        path: '/review',
        route: ReviewRoutes,
    }
]
moduleRoutes.forEach(route => router.use(route.path, route.route))

module.exports = router
