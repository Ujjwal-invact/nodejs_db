const IHDEmailTemplate =(name="", wj_time= "3:00 PM", wj_rej_link="https://event.webinarjam.com/channel/ihd",dynamicDate="Today") =>`
  <div style="
    font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; color: #333;padding-top:20px;padding-bottom:20px
    ">
    <div
        style="max-width: 95%; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);">
        
        <!-- Header Banner -->
        <!-- <img src="IMAGE_URL" alt="Header Banner" style="width: 100%; display: block;"> -->

        <!-- Content Section -->
        <div style="padding: 30px;">
            <p style="font-size: 18px; line-height: 1.6;">
                Hey <strong>${name}</strong>,
            </p>

            <p style="font-size: 18px; line-height: 1.6; margin-top: 15px;">
                <strong>Congratulations!</strong> <br>
                You’ve been selected for <strong>Invact’s Hiring Drive.</strong> <br>
                We’re seeking individuals ready to launch their careers, whether as freshers or returning after a break, to join us and work closely with the founder and product team.
            </p>

            <!-- Placement Session Details -->
            <h2
                style="font-size: 24px; margin-top: 30px; font-weight: bold; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                Placement Session Details</h2>

            <div style="margin-top: 25px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                <p style="font-size: 16px; margin: 10px 0;">
                    <strong>Date:</strong> ${dynamicDate}
                </p>
                <p style="font-size: 16px; margin: 10px 0;">
                    <strong>Time:</strong> ${wj_time}
                </p>
                <p style="font-size: 16px; margin: 10px 0;">
                    <strong>Joining Link:</strong> <a href="${wj_rej_link}" style="color: #007bff;">Click here to join</a>
                </p>
            </div>

            <!-- Closing Note -->
            <p style="font-size: 16px; margin-top: 30px;">
                We look forward to seeing you at ${wj_time}!
            </p>
            <p style="font-size: 22px; font-weight: bold; color: #007bff; margin-top: 10px;">
                Best wishes! 🎉
            </p>

            <!-- Footer -->
            <div
                style="margin-top: 30px; padding: 20px; text-align: center; background-color: #f9f9f9; border-top: 1px solid #ddd;">
                <p style="font-size: 14px; color: #888; margin-top: 10px; font-style: italic;">
                    ~Team Invact
                </p>
            </div>
        </div>
    </div>
</div>`

module.exports= IHDEmailTemplate