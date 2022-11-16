(function($) {
  showSwal = function(type) {
    'use strict';
    if (type === 'basic') {
      swal({
        text: 'Any fool can use a computer',
        button: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn btn-primary"
        }
      })

    } else if (type === 'title-and-text') {
      swal({
        title: 'Read the alert!',
        text: 'Click OK to close this alert',
        button: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn btn-primary"
        }
      })

    } else if (type === 'success-message') {
      swal({
        title: 'Congratulations!',
        text: 'You entered the correct answer',
        icon: 'success',
        button: {
          text: "Continue",
          value: true,
          visible: true,
          className: "btn btn-primary"
        }
      })

    } else if (type === 'auto-close') {
      swal({
        title: 'Auto close alert!',
        text: 'I will close in 2 seconds.',
        timer: 2000,
        button: false
      }).then(
        function() {},
        // handling the promise rejection
        function(dismiss) {
          if (dismiss === 'timer') {
            console.log('I was closed by the timer')
          }
        }
      )
    } else if (type === 'warning-message-and-cancel') {
      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3f51b5',
        cancelButtonColor: '#ff4081',
        confirmButtonText: 'Great ',
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
          },
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-primary",
            closeModal: true,
          }
        }
      }).then((data) => {
        console.log()
        if(data === true){
          const id = document.getElementById('category_id').value
          window.location = "/Admin/deleteCategory/?id=" + id ;
        } 
        // window.location = "redirectURL";
    });
    
    } else if (type === 'custom-html') {
      swal({
        content: {
          element: "input",
          attributes: {
            placeholder: "Type your password",
            type: "password",
            class: 'form-control'
          },
        },
        button: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn btn-primary"
        }
      })
    } else if (type === 'block-customer') {
      swal({
        title: 'Are you sure?',
        text: "You really want to block the customer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3f51b5',
        cancelButtonColor: '#ff4081',
        confirmButtonText: 'Great ',
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
          },
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-primary",
            closeModal: true,
          }
        }
      }).then((data) => {
        console.log()
        if(data === true){
          const id = document.getElementById('customer_id').value
          window.location = "/Admin/BlockCustomer/?id=" + id ;
        } 
        // window.location = "redirectURL";
    });
    
    } else if (type === 'unblock-customer') {
      swal({
        title: 'Are you sure?',
        text: "You really want to unblock the customer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3f51b5',
        cancelButtonColor: '#ff4081',
        confirmButtonText: 'Great ',
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
          },
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-primary",
            closeModal: true,
          }
        }
      }).then((data) => {
        console.log()
        if(data === true){
          const id = document.getElementById('customer_id').value
          window.location = "/Admin/unBlockCustomer/?id=" + id ;
        } 
        // window.location = "redirectURL";
    });
    
    }  else if (type === 'delete-categoryOffer') {
      swal({
        title: 'Are you sure?',
        text: "You really want to delete this Category Offer?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3f51b5',
        cancelButtonColor: '#ff4081',
        confirmButtonText: 'Great ',
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
          },
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-primary",
            closeModal: true,
          }
        }
      }).then((data) => {
        if(data === true){
          const id = document.getElementById('id').value
          window.location = "/Admin/deleteCategoryOffer/?offer_id=" + id ;
        } 
        // window.location = "redirectURL";
    });
    
    }  else if (type === 'delete-product') {
      swal({
        title: 'Are you sure?',
        text: "You really want to delete this product ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3f51b5',
        cancelButtonColor: '#ff4081',
        confirmButtonText: 'Great ',
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
          },
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-primary",
            closeModal: true,
          }
        }
      }).then((data) => {
        if(data === true){
          const id = document.getElementById('id').value
          window.location = "/admin/delete-products/"+id ;
        } 
        // window.location = "redirectURL";
    });
    
    }
  } 
})(jQuery);
