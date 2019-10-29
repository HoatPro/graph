module.exports = {
    0: {
        0: { name: 'Tạo đơn đặt hàng', type: 'order', next: 1, back: null },
        1: { name: 'Xác nhận đơn đặt hàng', type: 'order', next: 2, back: 1 },
        2: { name: 'Xuất kho', type: 'stock', nextMethod: 'stockDecrement', next: 3, back: 2 },
        3: { name: 'Xác nhận online', type: 'stock', backMethod: 'stockIncrement', next: 4, back: 2 },
        4: { name: 'Online', next: null, back: null },
        5: { name: 'Xác nhận online không thành công', next: null, back: 3 },
        6: { name: 'Hủy' },
        7: { name: 'Đóng' }
    },
    1: {
        0: { name: 'createOrder', type: 'order', next: 1, back: null },
        1: { name: 'orderVerifying', type: 'order', next: 2, back: 1 },
        2: { name: 'delivering', type: 'stock', nextMethod: 'stockDecrement', next: 3, back: 2 },
        3: { name: 'onlineVerifying', type: 'stock', backMethod: 'stockIncrement', next: 4, back: 2 },
        4: { name: 'onlineVerifySuccess', next: null, back: null },
        5: { name: 'onlineVerifyFailure', next: null, back: 3 },
        8: { name: 'canceled' },
        9: { name: 'closed' }
    },
    2: {
        0: { name: 'Tạo yêu cầu mua hàng', type: 'buying', next: 1, back: null },
        1: { name: 'Yêu cầu tạo mã hàng', type: 'buying', next: 2, back: 1 },
        2: { name: 'Tạo đơn hàng', type: 'order', next: 3, back: 1 },
        3: { name: 'Xác nhận đơn hàng', type: 'stock', nextMethod: 'stockDecrement', next: 3, back: 2 },
        4: { name: 'Mua hàng', type: 'stock', backMethod: 'stockIncrement', next: 5, back: 2 },
        5: { name: 'Nhập kho', next: null, back: null },
        7: { name: 'canceled' },
        8: { name: 'closed' }
    }
};