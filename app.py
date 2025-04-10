import os
import logging
from flask import Flask, render_template, request, flash, redirect, url_for

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = 'brics_emissions_secret_key'  # Required for flash messages

# Store messages in memory (for demo purposes)
# In a production app, you would use a database
contact_messages = []


@app.route('/')
def index():
    logger.info("Serving index page")
    return render_template('index.html')


@app.route('/visualization')
def visualization():
    logger.info("Serving visualization page")
    return render_template('visualization.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        logger.info("Received contact form submission")
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')

        # Validate form data
        if not all([name, email, subject, message]):
            logger.warning("Form validation failed - missing fields")
            flash('Please fill out all fields in the form.', 'error')
        else:
            # Save message (in a real app, you would store in a database)
            contact_messages.append({
                'name': name,
                'email': email,
                'subject': subject,
                'message': message
            })

            # Log all messages to console
            logger.info(f"All messages: {contact_messages}")

            logger.info(f"Saved message from {name} <{email}>: {subject}")
            flash('Thank you for your message! We will get back to you soon.', 'success')
            return redirect(url_for('contact'))

    logger.info("Serving contact page")
    return render_template('contact.html')


# Add a route to view all messages
@app.route('/debug/messages')
def debug_messages():
    """Debug endpoint to view all submitted messages"""
    return {'messages': contact_messages}


if __name__ == '__main__':
    logger.info("Starting Flask application")
    app.run(debug=True)