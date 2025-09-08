import Swal from 'sweetalert2';

// Success notification
export const showSuccess = (message, title = 'Success!') => {
    Swal.fire({
        icon: 'success',
        title: title,
        text: message,
        confirmButtonColor: '#3b82f6',
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
    });
};

// Error notification
export const showError = (message, title = 'Error!') => {
    Swal.fire({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonColor: '#ef4444',
        timer: 4000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
    });
};

// Warning notification
export const showWarning = (message, title = 'Warning!') => {
    Swal.fire({
        icon: 'warning',
        title: title,
        text: message,
        confirmButtonColor: '#f59e0b',
        timer: 4000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
    });
};

// Info notification
export const showInfo = (message, title = 'Info') => {
    Swal.fire({
        icon: 'info',
        title: title,
        text: message,
        confirmButtonColor: '#3b82f6',
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
    });
};

// Confirmation dialog
export const showConfirm = (message, title = 'Are you sure?') => {
    return Swal.fire({
        title: title,
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    });
};

// Loading state
export const showLoading = (message = 'Loading...') => {
    Swal.fire({
        title: message,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

// Close loading
export const closeLoading = () => {
    Swal.close();
};

// Form validation error display
export const showValidationErrors = (errors) => {
    let errorMessage = '';
    Object.keys(errors).forEach(key => {
        errorMessage += `${errors[key][0]}\n`;
    });
    
    Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: errorMessage,
        confirmButtonColor: '#ef4444',
    });
};











