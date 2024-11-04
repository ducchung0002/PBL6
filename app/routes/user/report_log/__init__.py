from flask import Blueprint, render_template

from app.decorators import login_required

report_log_bp = Blueprint('report_log', __name__)


@report_log_bp.route('/reporthistory', methods=['GET'])
@login_required()
def show_report_history():
    # Bạn có thể thực hiện truy vấn dữ liệu từ DB nếu muốn
    # Ví dụ: Lấy danh sách các báo cáo đã gửi. Nhưng ở đây tạm thời hiển thị giao diện tĩnh.

    return render_template('user/report_log/report_log.html')
