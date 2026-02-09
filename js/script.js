// ใส่ไว้ในไฟล์ .js ของคุณ หรือภายใต้ <script> ... </script>
document.addEventListener('click', function() {
    const statusIsland = document.querySelector('.online-status-fixed');
    
    // ตรวจสอบว่ามีคลาส active อยู่หรือยัง ถ้ายังให้เพิ่มเข้าไป
    statusIsland.classList.add('active');

    // (แนะนำเพิ่มเติม) ให้มันหดกลับเองหลังจากโชว์ไปแล้ว 5 วินาที
    setTimeout(() => {
        statusIsland.classList.remove('active');
    }, 5000); 
});

