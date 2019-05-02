import $ from 'jquery'
import page from 'page'

let subscribeProgress = false

$(function () {
  $('#modal-subscribe')
    .on('hidden.bs.modal', function () {
      $(this)
        .find('[role="status-success"]').hide().end()
        .find('[role="input-form"]').show().end()
        .find('button[type="submit"]').show().end()
        .find('input[name="email"]').removeClass('is-invalid').val('')

      page('/#')
    })
    .on('shown.bs.modal', function () {
      $(this)
        .find('input[name="email"]').focus()
    })
    .on('submit', 'form', function (event) {
      event.preventDefault()
      if (subscribeProgress) {
        return
      }

      const $inputForm = $('[role="input-form"]', this)
      const $statusSuccess = $('[role="status-success"]', this)
      const $control = $('button[type="submit"]', this)
      const $email = $('input[name="email"]', this)
      const email = $.trim($email.val())
      const isValid = email && /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email)

      $email.toggleClass('is-invalid', !isValid)

      if (!isValid) {
        $email
          .select()
          .next('.invalid-feedback')
          .text(email ? 'Please correct e-mail address' : 'Required field')

      } else {
        subscribeProgress = true

        $control
          .prop('disabled', true)
          .find('[role="status"]')
          .show()

        $.ajax({
          url: 'https://ethplorer.us10.list-manage.com/subscribe/post-json',
          dataType: 'jsonp',
          jsonp: 'c',
          data: {
            u: '112cedc592a0c0fbdcaab77b0',
            id: 'd071808ab0',
            EMAIL: email,
          },
        })
        .then((data) => {
          subscribeProgress = false

          $control
            .prop('disabled', false)
            .find('[role="status"]')
            .hide()

          if (data.result === 'success') {
            $control.hide()
            $inputForm.hide()
            $statusSuccess.show()
          } else {
            let message = data.msg || 'Please correct e-mail address'
            if (message.indexOf('is already subscribed')) {
              message = message.replace('href="https://', 'target="_blank" class="text-danger" href="https://')
            }

            $email
              .toggleClass('is-invalid', true)
              .select()
              .next('.invalid-feedback')
              .html(message)
          }

        }, (xhr, textStatus) => {
          subscribeProgress = false

          $control
            .prop('disabled', false)
            .find('[role="status"]')
            .hide()

          $email
            .toggleClass('is-invalid', true)
            .select()
            .next('.invalid-feedback')
            .text('Internal error. Please try again later.')
        })
      }
    })
    .on('input', 'input[name="email"]', function () {
      $(this).removeClass('is-invalid')
    })
})
