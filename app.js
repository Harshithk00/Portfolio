import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // TLS port
    secure: false, // Use false for 587, true for 465
    auth: {
      user: process.env.EMAIL, // Replace with your Gmail address
      pass: process.env.PASSWORD, // Replace with your app password
    },
  });


app.get('/', (req, res) => {
    res.render("index.ejs");
});
  

app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;
  
    if (!name || !email || !message) {
        res.render('response', { success: false });
    }
  
    try {
      // Mail Options
      const mailOptions = {
        from: `"${name}" <${email}>`, // Sender info
        to: "contact@harshitk.me", // Forward to this email
        subject: `Help Request from ${name}`, // Subject line
        text: message, // Plain text body
        html: `<p><strong>From:</strong> ${name} (${email})</p>
               <p><strong>Help Request:</strong><br>${message}</p>`, // HTML body
      };
  
      // Send Email
      await transporter.sendMail(mailOptions);
  
      res.render('response', { success: true });
    } catch (error) {
      console.error(error);
      res.render('response', { success: false });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
