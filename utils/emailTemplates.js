exports.verification = (token) => {
  let verificationTemplate = `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <!-- Turn off iOS phone number autodetect -->
  <meta name="format-detection" content="telephone=no">
  <style>
    body, p {
          font-family: 'Helvetica Neue', Helvetica,Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: none;
      }
      table {
          border-collapse: collapse;
          border-spacing: 0;
          border: 0;
          padding: 0;
      }
      img {
          margin: 0;
          padding: 0;
      }
  
      .content {
          width: 600px;
      }
  
      .no_text_resize {
          -moz-text-size-adjust: none;
          -webkit-text-size-adjust: none;
          -ms-text-size-adjust: none;
          text-size-adjust: none;
      }
  
      /* Media Queries */
      @media all and (max-width: 600px) {
  
          table[class="content"] {
              width: 100% !important;
          }
  
          tr[class="grid-no-gutter"] td[class="grid__col"] {
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="grid__col"] {
              padding-left: 18px !important;
              padding-right: 18px !important;
          }
  
          table[class="small_full_width"] {
              width: 100% !important;
              padding-bottom: 10px;
          }
  
          a[class="header-link"] {
              margin-right: 0 !important;
              margin-left: 10px !important;
          }
  
          a[class="btn"] {
              width: 100%;
              border-left-width: 0px !important;
              border-right-width: 0px !important;
          }
  
          table[class="col-layout"] {
              width: 100% !important;
          }
  
          td[class="col-container"] {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="col-nav-items"] {
              display: inline-block !important;
              padding-left: 0 !important;
              padding-right: 10px !important;
              background: none !important;
          }
  
          img[class="col-img"] {
              height: auto !important;
              max-width: 520px !important;
              width: 100% !important;
          }
  
          td[class="col-center-sm"] {
              text-align: center;
          }
  
          tr[class="footer-attendee-cta"] > td[class="grid__col"] {
              padding: 24px 0 0 !important;
          }
  
          td[class="col-footer-cta"] {
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="footer-links"] {
              text-align: left !important;
          }
  
          .hide-for-small {
              display: none !important;
          }
  
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .small_full_width {
              width: 100% !important;
              padding-bottom: 10px;
          }
  
          .table__ridge {
              height: 7px !important;
          }
  
          .table__ridge img {
              display: none !important;
          }
  
          .table__ridge--top {
              background-image: url(https://cdn.evbstatic.com/s3-s3/marketing/emails/modules/ridges_top_fullx2.jpg) !important;
              background-size: 170% 7px;
          }
  
          .table__ridge--bottom {
              background-image: url(https://cdn.evbstatic.com/s3-s3/marketing/emails/modules/ridges_bottom_fullx2.jpg) !important;
              background-size: 170% 7px;
          }
  
          .summary-table__total {
              padding-right: 10px !important;
          }
  
          .app-cta {
              display: none !important;
          }
  
          .app-cta__mobile {
              width: 100% !important;
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              float: none !important;
              display: block !important;
              margin-top: 12px !important;
              visibility: visible;
              font-size: inherit !important;
          }
  
          /* List Event Cards */
          .list-card__header {
              width: 130px !important;
          }
  
          .list-card__label {
              width: 130px !important;
          }
  
          .list-card__image-wrapper {
              width: 130px !important;
              height: 65px !important;
          }
  
          .list-card__image {
              max-width: 130px !important;
              max-height: 65px !important;
          }
  
          .list-card__body {
              padding-left: 10px !important;
          }
  
          .list-card__title {
              margin-bottom: 10px !important;
          }
  
          .list-card__date {
              padding-top: 0 !important;
          }
      }
  
      @media all and (device-width: 768px) and (device-height: 1024px) and (orientation:landscape) {
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .ribbon-mobile__text {
              padding: 0 !important;
          }
      }
  
      @media all and (device-width: 768px) and (device-height: 1024px) and (orientation:portrait) {
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .ribbon-mobile__text {
              padding: 0 !important;
          }
      }
  
      @media screen and (min-device-height:480px) and (max-device-height:568px), (min-device-width : 375px) and (max-device-width : 667px) and (-webkit-min-device-pixel-ratio : 2), (min-device-width : 414px) and (max-device-width : 736px) and (-webkit-min-device-pixel-ratio : 3) {
  
          .hide_for_iphone {
              display: none !important;
          }
  
          .passbook {
              width: auto !important;
              height: auto !important;
              line-height: auto !important;
              visibility: visible !important;
              display: block !important;
              max-height: none !important;
              overflow: visible !important;
              float: none !important;
              text-indent: 0 !important;
              font-size: inherit !important;
          }
      }
  </style>
</head>
<!-- Global container with background styles. Gmail converts BODY to DIV so we
  lose properties like BGCOLOR. -->

<body border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" bgcolor="#F7F7F7" style="margin: 0;">
  <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" bgcolor="#F7F7F7">
    <tr>
      <td style="padding-right: 10px; padding-left: 10px;">
        <!-- Outlook Hack (doesn't support max-width property until 2013) -->
        <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7">
              <tr>
                <td>
                <![endif]-->
        <table class="content" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7" style="width: 600px; max-width: 600px;">
          <tr>
            <td width="33%" valign="middle" style="text-align:left; padding:20px 0 10px 0;">
             
            </td>
            <td width="66%" valign="middle" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: right; padding-top: 12px; vertical-align: middle;"></td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
                </td>
              </tr>
            </table>
          <![endif]-->
      </td>
    </tr>
    <tr>
      <td>
        <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
              <tr>
                <td>
                <![endif]-->
        <table class="content" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7" style="width: 600px; max-width: 600px;">
          <tr>
            <td colspan="2" style="background: #fff; border-radius: 8px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    <tr class="">
                      <td class="grid__col" style="font-family: 'Helvetica neue', Helvetica, arial, sans-serif; padding: 32px 40px; ">

                        <h2 style="color: #404040; font-weight: 300; margin: 0 0 12px 0; font-size: 24px; line-height: 30px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; ">

        Hi there,
    
</h2>

                        <p style="color: #666666; font-weight: 400; font-size: 15px; line-height: 21px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; " class="">Please click on the button to reset your password for Naturist</p>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 12px; margin-bottom: 12px; margin: 24px 0">
                          <tr>
                            <td>
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                  <td style="-webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px;">
                                    <a href="https://naturist-front.herokuapp.com/activate-account.html?verfiy=${token}" target="_blank" style="display:inline-block; color: #fff; font-weight: 400; border-left: 15px solid; border-right: 15px solid; border-top: 12px solid; border-bottom: 12px solid; font-size: 17px; text-decoration: none; text-align: center; -webkit-text-size-adjust: none; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; background-color: #27ae60; border-color: #27ae60;"
                                      class="btn email-verify"> <span style="padding-left: 5px; padding-right: 5px;">
                                Verify Your Email Address
                            </span>

                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <p style="color: #666666; font-weight: 400; font-size: 15px; line-height: 21px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; " class="">If you didn&#39;t attempt to reset your password with Naturist, please delete this email.</p>
                        <p style="color: #666666; font-weight: 400; font-size: 17px; line-height: 24px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; margin-bottom: 6px; margin-top: 24px;" class="">Cheers,</p>
 
                      </td>
                    </tr>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
   
        
</body>

</html>`;
  return verificationTemplate;
};

exports.resetPassword = (token) => {
  let resetTemplate = `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <!-- Turn off iOS phone number autodetect -->
  <meta name="format-detection" content="telephone=no">
  <style>
    body, p {
          font-family: 'Helvetica Neue', Helvetica,Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: none;
      }
      table {
          border-collapse: collapse;
          border-spacing: 0;
          border: 0;
          padding: 0;
      }
      img {
          margin: 0;
          padding: 0;
      }
  
      .content {
          width: 600px;
      }
  
      .no_text_resize {
          -moz-text-size-adjust: none;
          -webkit-text-size-adjust: none;
          -ms-text-size-adjust: none;
          text-size-adjust: none;
      }
  
      /* Media Queries */
      @media all and (max-width: 600px) {
  
          table[class="content"] {
              width: 100% !important;
          }
  
          tr[class="grid-no-gutter"] td[class="grid__col"] {
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="grid__col"] {
              padding-left: 18px !important;
              padding-right: 18px !important;
          }
  
          table[class="small_full_width"] {
              width: 100% !important;
              padding-bottom: 10px;
          }
  
          a[class="header-link"] {
              margin-right: 0 !important;
              margin-left: 10px !important;
          }
  
          a[class="btn"] {
              width: 100%;
              border-left-width: 0px !important;
              border-right-width: 0px !important;
          }
  
          table[class="col-layout"] {
              width: 100% !important;
          }
  
          td[class="col-container"] {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="col-nav-items"] {
              display: inline-block !important;
              padding-left: 0 !important;
              padding-right: 10px !important;
              background: none !important;
          }
  
          img[class="col-img"] {
              height: auto !important;
              max-width: 520px !important;
              width: 100% !important;
          }
  
          td[class="col-center-sm"] {
              text-align: center;
          }
  
          tr[class="footer-attendee-cta"] > td[class="grid__col"] {
              padding: 24px 0 0 !important;
          }
  
          td[class="col-footer-cta"] {
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="footer-links"] {
              text-align: left !important;
          }
  
          .hide-for-small {
              display: none !important;
          }
  
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .small_full_width {
              width: 100% !important;
              padding-bottom: 10px;
          }
  
          .table__ridge {
              height: 7px !important;
          }
  
          .table__ridge img {
              display: none !important;
          }
  
          .table__ridge--top {
              background-image: url(https://cdn.evbstatic.com/s3-s3/marketing/emails/modules/ridges_top_fullx2.jpg) !important;
              background-size: 170% 7px;
          }
  
          .table__ridge--bottom {
              background-image: url(https://cdn.evbstatic.com/s3-s3/marketing/emails/modules/ridges_bottom_fullx2.jpg) !important;
              background-size: 170% 7px;
          }
  
          .summary-table__total {
              padding-right: 10px !important;
          }
  
          .app-cta {
              display: none !important;
          }
  
          .app-cta__mobile {
              width: 100% !important;
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              float: none !important;
              display: block !important;
              margin-top: 12px !important;
              visibility: visible;
              font-size: inherit !important;
          }
  
          /* List Event Cards */
          .list-card__header {
              width: 130px !important;
          }
  
          .list-card__label {
              width: 130px !important;
          }
  
          .list-card__image-wrapper {
              width: 130px !important;
              height: 65px !important;
          }
  
          .list-card__image {
              max-width: 130px !important;
              max-height: 65px !important;
          }
  
          .list-card__body {
              padding-left: 10px !important;
          }
  
          .list-card__title {
              margin-bottom: 10px !important;
          }
  
          .list-card__date {
              padding-top: 0 !important;
          }
      }
  
      @media all and (device-width: 768px) and (device-height: 1024px) and (orientation:landscape) {
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .ribbon-mobile__text {
              padding: 0 !important;
          }
      }
  
      @media all and (device-width: 768px) and (device-height: 1024px) and (orientation:portrait) {
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .ribbon-mobile__text {
              padding: 0 !important;
          }
      }
  
      @media screen and (min-device-height:480px) and (max-device-height:568px), (min-device-width : 375px) and (max-device-width : 667px) and (-webkit-min-device-pixel-ratio : 2), (min-device-width : 414px) and (max-device-width : 736px) and (-webkit-min-device-pixel-ratio : 3) {
  
          .hide_for_iphone {
              display: none !important;
          }
  
          .passbook {
              width: auto !important;
              height: auto !important;
              line-height: auto !important;
              visibility: visible !important;
              display: block !important;
              max-height: none !important;
              overflow: visible !important;
              float: none !important;
              text-indent: 0 !important;
              font-size: inherit !important;
          }
      }
  </style>
</head>
<!-- Global container with background styles. Gmail converts BODY to DIV so we
  lose properties like BGCOLOR. -->

<body border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" bgcolor="#F7F7F7" style="margin: 0;">
  <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" bgcolor="#F7F7F7">
    <tr>
      <td style="padding-right: 10px; padding-left: 10px;">
        <!-- Outlook Hack (doesn't support max-width property until 2013) -->
        <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7">
              <tr>
                <td>
                <![endif]-->
        <table class="content" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7" style="width: 600px; max-width: 600px;">
          <tr>
            <td width="33%" valign="middle" style="text-align:left; padding:20px 0 10px 0;">
             
            </td>
            <td width="66%" valign="middle" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: right; padding-top: 12px; vertical-align: middle;"></td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
                </td>
              </tr>
            </table>
          <![endif]-->
      </td>
    </tr>
    <tr>
      <td>
        <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
              <tr>
                <td>
                <![endif]-->
        <table class="content" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7" style="width: 600px; max-width: 600px;">
          <tr>
            <td colspan="2" style="background: #fff; border-radius: 8px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    <tr class="">
                      <td class="grid__col" style="font-family: 'Helvetica neue', Helvetica, arial, sans-serif; padding: 32px 40px; ">

                        <h2 style="color: #404040; font-weight: 300; margin: 0 0 12px 0; font-size: 24px; line-height: 30px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; ">

        Hi there,
    
</h2>

                        <p style="color: #666666; font-weight: 400; font-size: 15px; line-height: 21px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; " class="">Please click on the button to reset you password</p>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 12px; margin-bottom: 12px; margin: 24px 0">
                          <tr>
                            <td>
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                  <td style="-webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px;">
                                    <a href="https://naturist-front.herokuapp.com/reset-password.html?token=${token}" target="_blank" style="display:inline-block; color: #fff; font-weight: 400; border-left: 15px solid; border-right: 15px solid; border-top: 12px solid; border-bottom: 12px solid; font-size: 17px; text-decoration: none; text-align: center; -webkit-text-size-adjust: none; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; background-color: #27ae60; border-color: #27ae60;"
                                      class="btn email-verify"> <span style="padding-left: 5px; padding-right: 5px;">
                                Reset Your Password
                            </span>

                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <p style="color: #666666; font-weight: 400; font-size: 15px; line-height: 21px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; " class="">If you didn&#39;t attempt to reset your password with Naturist, please delete this email.</p>
                        <p style="color: #666666; font-weight: 400; font-size: 17px; line-height: 24px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; margin-bottom: 6px; margin-top: 24px;" class="">Cheers,</p>
 
                      </td>
                    </tr>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
   
        
</body>

</html>`;
  return resetTemplate;
};

exports.updateEmail = (token) => {
  let updateMailTemplate = `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <!-- Turn off iOS phone number autodetect -->
  <meta name="format-detection" content="telephone=no">
  <style>
    body, p {
          font-family: 'Helvetica Neue', Helvetica,Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: none;
      }
      table {
          border-collapse: collapse;
          border-spacing: 0;
          border: 0;
          padding: 0;
      }
      img {
          margin: 0;
          padding: 0;
      }
  
      .content {
          width: 600px;
      }
  
      .no_text_resize {
          -moz-text-size-adjust: none;
          -webkit-text-size-adjust: none;
          -ms-text-size-adjust: none;
          text-size-adjust: none;
      }
  
      /* Media Queries */
      @media all and (max-width: 600px) {
  
          table[class="content"] {
              width: 100% !important;
          }
  
          tr[class="grid-no-gutter"] td[class="grid__col"] {
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="grid__col"] {
              padding-left: 18px !important;
              padding-right: 18px !important;
          }
  
          table[class="small_full_width"] {
              width: 100% !important;
              padding-bottom: 10px;
          }
  
          a[class="header-link"] {
              margin-right: 0 !important;
              margin-left: 10px !important;
          }
  
          a[class="btn"] {
              width: 100%;
              border-left-width: 0px !important;
              border-right-width: 0px !important;
          }
  
          table[class="col-layout"] {
              width: 100% !important;
          }
  
          td[class="col-container"] {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="col-nav-items"] {
              display: inline-block !important;
              padding-left: 0 !important;
              padding-right: 10px !important;
              background: none !important;
          }
  
          img[class="col-img"] {
              height: auto !important;
              max-width: 520px !important;
              width: 100% !important;
          }
  
          td[class="col-center-sm"] {
              text-align: center;
          }
  
          tr[class="footer-attendee-cta"] > td[class="grid__col"] {
              padding: 24px 0 0 !important;
          }
  
          td[class="col-footer-cta"] {
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="footer-links"] {
              text-align: left !important;
          }
  
          .hide-for-small {
              display: none !important;
          }
  
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .small_full_width {
              width: 100% !important;
              padding-bottom: 10px;
          }
  
          .table__ridge {
              height: 7px !important;
          }
  
          .table__ridge img {
              display: none !important;
          }
  
          .table__ridge--top {
              background-image: url(https://cdn.evbstatic.com/s3-s3/marketing/emails/modules/ridges_top_fullx2.jpg) !important;
              background-size: 170% 7px;
          }
  
          .table__ridge--bottom {
              background-image: url(https://cdn.evbstatic.com/s3-s3/marketing/emails/modules/ridges_bottom_fullx2.jpg) !important;
              background-size: 170% 7px;
          }
  
          .summary-table__total {
              padding-right: 10px !important;
          }
  
          .app-cta {
              display: none !important;
          }
  
          .app-cta__mobile {
              width: 100% !important;
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              float: none !important;
              display: block !important;
              margin-top: 12px !important;
              visibility: visible;
              font-size: inherit !important;
          }
  
          /* List Event Cards */
          .list-card__header {
              width: 130px !important;
          }
  
          .list-card__label {
              width: 130px !important;
          }
  
          .list-card__image-wrapper {
              width: 130px !important;
              height: 65px !important;
          }
  
          .list-card__image {
              max-width: 130px !important;
              max-height: 65px !important;
          }
  
          .list-card__body {
              padding-left: 10px !important;
          }
  
          .list-card__title {
              margin-bottom: 10px !important;
          }
  
          .list-card__date {
              padding-top: 0 !important;
          }
      }
  
      @media all and (device-width: 768px) and (device-height: 1024px) and (orientation:landscape) {
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .ribbon-mobile__text {
              padding: 0 !important;
          }
      }
  
      @media all and (device-width: 768px) and (device-height: 1024px) and (orientation:portrait) {
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .ribbon-mobile__text {
              padding: 0 !important;
          }
      }
  
      @media screen and (min-device-height:480px) and (max-device-height:568px), (min-device-width : 375px) and (max-device-width : 667px) and (-webkit-min-device-pixel-ratio : 2), (min-device-width : 414px) and (max-device-width : 736px) and (-webkit-min-device-pixel-ratio : 3) {
  
          .hide_for_iphone {
              display: none !important;
          }
  
          .passbook {
              width: auto !important;
              height: auto !important;
              line-height: auto !important;
              visibility: visible !important;
              display: block !important;
              max-height: none !important;
              overflow: visible !important;
              float: none !important;
              text-indent: 0 !important;
              font-size: inherit !important;
          }
      }
  </style>
</head>
<!-- Global container with background styles. Gmail converts BODY to DIV so we
  lose properties like BGCOLOR. -->

<body border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" bgcolor="#F7F7F7" style="margin: 0;">
  <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" bgcolor="#F7F7F7">
    <tr>
      <td style="padding-right: 10px; padding-left: 10px;">
        <!-- Outlook Hack (doesn't support max-width property until 2013) -->
        <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7">
              <tr>
                <td>
                <![endif]-->
        <table class="content" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7" style="width: 600px; max-width: 600px;">
          <tr>
            <td width="33%" valign="middle" style="text-align:left; padding:20px 0 10px 0;">
             
            </td>
            <td width="66%" valign="middle" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: right; padding-top: 12px; vertical-align: middle;"></td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
                </td>
              </tr>
            </table>
          <![endif]-->
      </td>
    </tr>
    <tr>
      <td>
        <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
              <tr>
                <td>
                <![endif]-->
        <table class="content" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7" style="width: 600px; max-width: 600px;">
          <tr>
            <td colspan="2" style="background: #fff; border-radius: 8px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    <tr class="">
                      <td class="grid__col" style="font-family: 'Helvetica neue', Helvetica, arial, sans-serif; padding: 32px 40px; ">

                        <h2 style="color: #404040; font-weight: 300; margin: 0 0 12px 0; font-size: 24px; line-height: 30px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; ">

        Hi there,
    
</h2>

                        <p style="color: #666666; font-weight: 400; font-size: 15px; line-height: 21px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; " class="">Please click on the button to complete the verification process for Naturist</p>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 12px; margin-bottom: 12px; margin: 24px 0">
                          <tr>
                            <td>
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                  <td style="-webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px;">
                                    <a href="https://naturist-front.herokuapp.com/update-email.html?token=${token}" target="_blank" style="display:inline-block; color: #fff; font-weight: 400; border-left: 15px solid; border-right: 15px solid; border-top: 12px solid; border-bottom: 12px solid; font-size: 17px; text-decoration: none; text-align: center; -webkit-text-size-adjust: none; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; background-color: #27ae60; border-color: #27ae60;"
                                      class="btn email-verify"> <span style="padding-left: 5px; padding-right: 5px;">
                                Change Your Email
                            </span>

                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <p style="color: #666666; font-weight: 400; font-size: 15px; line-height: 21px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; " class="">If you didn&#39;t attempt to change your email address with Naturist, please delete this email.</p>
                        <p style="color: #666666; font-weight: 400; font-size: 17px; line-height: 24px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; margin-bottom: 6px; margin-top: 24px;" class="">Cheers,</p>
 
                      </td>
                    </tr>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
   
        
</body>

</html>`;
  return updateMailTemplate;
};

exports.emailOTP = (OTP) => {
  let updateMailTemplate = `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <!-- Turn off iOS phone number autodetect -->
  <meta name="format-detection" content="telephone=no">
  <style>
    body, p {
          font-family: 'Helvetica Neue', Helvetica,Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: none;
      }
      table {
          border-collapse: collapse;
          border-spacing: 0;
          border: 0;
          padding: 0;
      }
      img {
          margin: 0;
          padding: 0;
      }
  
      .content {
          width: 600px;
      }
  
      .no_text_resize {
          -moz-text-size-adjust: none;
          -webkit-text-size-adjust: none;
          -ms-text-size-adjust: none;
          text-size-adjust: none;
      }
  
      /* Media Queries */
      @media all and (max-width: 600px) {
  
          table[class="content"] {
              width: 100% !important;
          }
  
          tr[class="grid-no-gutter"] td[class="grid__col"] {
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="grid__col"] {
              padding-left: 18px !important;
              padding-right: 18px !important;
          }
  
          table[class="small_full_width"] {
              width: 100% !important;
              padding-bottom: 10px;
          }
  
          a[class="header-link"] {
              margin-right: 0 !important;
              margin-left: 10px !important;
          }
  
          a[class="btn"] {
              width: 100%;
              border-left-width: 0px !important;
              border-right-width: 0px !important;
          }
  
          table[class="col-layout"] {
              width: 100% !important;
          }
  
          td[class="col-container"] {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="col-nav-items"] {
              display: inline-block !important;
              padding-left: 0 !important;
              padding-right: 10px !important;
              background: none !important;
          }
  
          img[class="col-img"] {
              height: auto !important;
              max-width: 520px !important;
              width: 100% !important;
          }
  
          td[class="col-center-sm"] {
              text-align: center;
          }
  
          tr[class="footer-attendee-cta"] > td[class="grid__col"] {
              padding: 24px 0 0 !important;
          }
  
          td[class="col-footer-cta"] {
              padding-left: 0 !important;
              padding-right: 0 !important;
          }
  
          td[class="footer-links"] {
              text-align: left !important;
          }
  
          .hide-for-small {
              display: none !important;
          }
  
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .small_full_width {
              width: 100% !important;
              padding-bottom: 10px;
          }
  
          .table__ridge {
              height: 7px !important;
          }
  
          .table__ridge img {
              display: none !important;
          }
  
          .table__ridge--top {
              background-image: url(https://cdn.evbstatic.com/s3-s3/marketing/emails/modules/ridges_top_fullx2.jpg) !important;
              background-size: 170% 7px;
          }
  
          .table__ridge--bottom {
              background-image: url(https://cdn.evbstatic.com/s3-s3/marketing/emails/modules/ridges_bottom_fullx2.jpg) !important;
              background-size: 170% 7px;
          }
  
          .summary-table__total {
              padding-right: 10px !important;
          }
  
          .app-cta {
              display: none !important;
          }
  
          .app-cta__mobile {
              width: 100% !important;
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              float: none !important;
              display: block !important;
              margin-top: 12px !important;
              visibility: visible;
              font-size: inherit !important;
          }
  
          /* List Event Cards */
          .list-card__header {
              width: 130px !important;
          }
  
          .list-card__label {
              width: 130px !important;
          }
  
          .list-card__image-wrapper {
              width: 130px !important;
              height: 65px !important;
          }
  
          .list-card__image {
              max-width: 130px !important;
              max-height: 65px !important;
          }
  
          .list-card__body {
              padding-left: 10px !important;
          }
  
          .list-card__title {
              margin-bottom: 10px !important;
          }
  
          .list-card__date {
              padding-top: 0 !important;
          }
      }
  
      @media all and (device-width: 768px) and (device-height: 1024px) and (orientation:landscape) {
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .ribbon-mobile__text {
              padding: 0 !important;
          }
      }
  
      @media all and (device-width: 768px) and (device-height: 1024px) and (orientation:portrait) {
          .ribbon-mobile {
              line-height: 1.3 !important;
          }
  
          .ribbon-mobile__text {
              padding: 0 !important;
          }
      }
  
      @media screen and (min-device-height:480px) and (max-device-height:568px), (min-device-width : 375px) and (max-device-width : 667px) and (-webkit-min-device-pixel-ratio : 2), (min-device-width : 414px) and (max-device-width : 736px) and (-webkit-min-device-pixel-ratio : 3) {
  
          .hide_for_iphone {
              display: none !important;
          }
  
          .passbook {
              width: auto !important;
              height: auto !important;
              line-height: auto !important;
              visibility: visible !important;
              display: block !important;
              max-height: none !important;
              overflow: visible !important;
              float: none !important;
              text-indent: 0 !important;
              font-size: inherit !important;
          }
      }
  </style>
</head>
<!-- Global container with background styles. Gmail converts BODY to DIV so we
  lose properties like BGCOLOR. -->

<body border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" bgcolor="#F7F7F7" style="margin: 0;">
  <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" bgcolor="#F7F7F7">
    <tr>
      <td style="padding-right: 10px; padding-left: 10px;">
        <!-- Outlook Hack (doesn't support max-width property until 2013) -->
        <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7">
              <tr>
                <td>
                <![endif]-->
        <table class="content" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7" style="width: 600px; max-width: 600px;">
          <tr>
            <td width="33%" valign="middle" style="text-align:left; padding:20px 0 10px 0;">
             
            </td>
            <td width="66%" valign="middle" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: right; padding-top: 12px; vertical-align: middle;"></td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
                </td>
              </tr>
            </table>
          <![endif]-->
      </td>
    </tr>
    <tr>
      <td>
        <!--[if (gte mso 9)|(IE)]>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
              <tr>
                <td>
                <![endif]-->
        <table class="content" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#F7F7F7" style="width: 600px; max-width: 600px;">
          <tr>
            <td colspan="2" style="background: #fff; border-radius: 8px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    <tr class="">
                      <td class="grid__col" style="font-family: 'Helvetica neue', Helvetica, arial, sans-serif; padding: 32px 40px; ">

                        <h2 style="color: #404040; font-weight: 300; margin: 0 0 12px 0; font-size: 24px; line-height: 30px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; ">

        Hi there,
    
</h2>

                        <p style="color: #666666; font-weight: 400; font-size: 15px; line-height: 21px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; " class="">Here is your OTP</p>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 12px; margin-bottom: 12px; margin: 24px 0">
                          <tr>
                            <td>
                              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                  <td style="-webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px;">
                                   
                                  <h1> ${OTP} </h1>

                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <p style="color: #666666; font-weight: 400; font-size: 15px; line-height: 21px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; " class="">If you didn&#39;t attempt to login with Naturist, please don't share this anyone.</p>
                        <p style="color: #666666; font-weight: 400; font-size: 17px; line-height: 24px; font-family: 'Helvetica neue', Helvetica, arial, sans-serif; margin-bottom: 6px; margin-top: 24px;" class="">Cheers,</p>
 
                      </td>
                    </tr>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
   
        
</body>

</html>`;
  return updateMailTemplate;
};
