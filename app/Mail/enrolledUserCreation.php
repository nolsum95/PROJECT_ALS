<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class EnrolledUserCreation extends Mailable
{
    public function __construct(
        public string $name,
        public string $email,
        public string $plainPassword
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your ALS Account Credentials');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.enrolled_user_creation');
    }
}
