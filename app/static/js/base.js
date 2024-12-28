const socket = io();

socket.on('connect', () => {
    console.log('Connected to server, socket id: ', socket.id);
});

window.alert = function (message, icon="error") {
    Swal.fire({
        icon: icon,
        title: message,
        confirmButtonText: 'OK'
    });
};

function deactivateModal(ModalId) {
    const modalElement = document.getElementById(ModalId);
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
    document.body.classList.remove('modal-open');
}
