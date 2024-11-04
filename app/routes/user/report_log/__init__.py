# PBL6/app/routes/user/report_log/__init__.py
from flask import Blueprint, render_template, session, redirect, url_for
from app.decorators import login_required
import logging

report_log_bp = Blueprint('report_log', __name__)

@report_log_bp.route('/reporthistory', methods=['GET'])
@login_required()
def show_report_history():
    user_session = session.get('user')
    if not user_session:
        logging.debug("Không tìm thấy user trong session, redirect đến login")
        return redirect(url_for('auth.login'))

    # Bạn có thể thực hiện truy vấn dữ liệu từ DB nếu muốn
    # Ví dụ: Lấy danh sách các báo cáo đã gửi. Nhưng ở đây tạm thời hiển thị giao diện tĩnh.

    return render_template('user/report_log/report_log.html')
