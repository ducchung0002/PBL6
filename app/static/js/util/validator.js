function emailValidation(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function dobValidate(dob){
    if (!dob) {
        alert('Ngày sinh không được để trống.');
        return false
    }
    const dobDate = new Date(dob);
    const year = dobDate.getFullYear();
    const month = dobDate.getMonth() + 1; // Months are zero-based
    const day = dobDate.getDate();
    const formattedDate = `${month}/${day}/${year}`;
    if (new Date(formattedDate) > new Date()) {
        alert('Ngày sinh không hợp lệ.');
        return false
    }
    return true
}