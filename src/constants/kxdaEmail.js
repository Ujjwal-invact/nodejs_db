const kxdaEmailTemplate =(name=" ", registrationLink="https://karmanx.com/data/webinar?utm_source=kxDaEmail&utm_medium=kxDaEmail&utm_campaign=kxDaEmail&utm_content=kxDaEmail") =>`

<body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Arial', sans-serif; color: #333;">

  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);">
    
    <!-- Header Section -->
    <div style="background-color: #007bff; color: #ffffff; text-align: center; padding: 30px 20px;">
      <h1 style="margin: 0; font-size: 28px; line-height: 1.4;">KarmanX Data Analyst Program</h1>
      <p style="margin: 10px 0 0; font-size: 16px;">Your Journey Starts Here!</p>
    </div>

    <!-- Content Section -->
    <div style="padding: 30px;">
      <p style="font-size: 18px; line-height: 1.6; margin: 0 0 15px;">
        Hello <strong>${name}</strong>,
      </p>

      <p style="font-size: 18px; line-height: 1.6; margin: 15px 0;">
        <strong>Congratulations!</strong> <br>
        We are excited to move forward with your profile for the <strong>KarmanX Data Analyst Program.</strong>
      </p>

      <!-- Steps Section -->
      <h2 style="font-size: 22px; color: #007bff; margin-top: 30px; font-weight: bold; text-align: center; text-transform: uppercase;">
        Next Steps
      </h2>
      <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #007bff; border-radius: 8px;">
        <ol style="font-size: 16px; margin: 0; padding: 0 20px; line-height: 1.8;">
          <li>Register for our exclusive webinar: <strong>“How to Crack Data Analyst Jobs.”</strong></li>
          <li>Attend the webinar to learn the critical steps and strategies.</li>
          <li>Start your Data Analyst journey with KarmanX!</li>
        </ol>
      </div>

      <!-- Registration Section -->
      <div style="text-align: center; margin-top: 30px;">
       
       
       <a href="${registrationLink}"
          style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; padding: 12px 20px; border-radius: 6px; font-weight: bold;">
          Register for the Webinar Now
        </a>

      </div>

      <!-- Reminder Section -->
      <p style="font-size: 16px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
        Please make sure to register and attend the webinar to secure your spot in the program.
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 10px 0; text-align: center;">
        <strong>Note:</strong> The waitlist is extensive, so take action now to avoid missing this opportunity.
      </p>
    </div>

    <!-- Footer Section -->
    <div style="background-color: #f9f9f9; text-align: center; padding: 20px; border-top: 1px solid #ddd;">
      <p style="font-size: 14px; color: #888; margin: 0; font-style: italic;">
        Thank You! <br>
        <strong>~Team KarmanX</strong>
      </p>
    </div>

  </div>

</body>

`

module.exports= kxdaEmailTemplate
