// ฟังก์ชันตรวจจับการคลิกทั้งหน้าจอ
document.addEventListener('click', function() {
    const statusBox = document.querySelector('.online-status-fixed');
    
    // สั่งให้เริ่ม Animation
    statusBox.classList.add('active');
    
    // ตั้งเวลาให้หดกลับเองหลังจาก 4 วินาที (ถ้าต้องการ)
    setTimeout(() => {
        statusBox.classList.remove('active');
    }, 4000);
});
