'use client'

import { useState } from 'react';
import Layout from "@/components/layout/Layout";
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

export default withPageAuthRequired(function AffiliateSubscription() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        website: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/direct/affiliate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        console.log(result)
        if (result?.success) {
            window.location.href = 'http://cc.payproglobal.com/AffiliateSignup/8DCA0D21874AE0E';  // Replace with the URL you want to navigate to
        } else {
            console.error('Failed to submit form:', result);
            // Optionally handle errors or show messages to the user here
        }

    };

    return (
        <Layout headerStyle={1} footerStyle={3}>
            <section className="tf-contact">
                <div className="tf-container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-8 col-md-9">
                            <div className="tf-heading">
                                <h2 className="heading">Join Our Affiliate Program</h2>
                                <p className="sub-heading">Subscribe and start earning by promoting our products</p>
                            </div>
                            <form onSubmit={handleSubmit} id="affiliate-subscribe-form" className="comment-form">
                                <div className="form-inner">
                                    <fieldset className="name">
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Full Name"
                                            className="tb-my-input"
                                            name="name"
                                            tabIndex={2}
                                            aria-required="true"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </fieldset>
                                    <fieldset className="email">
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Email"
                                            className="tb-my-input"
                                            name="email"
                                            tabIndex={2}
                                            aria-required="true"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </fieldset>


                                    <fieldset className="message">
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={4}
                                            placeholder="Where you'll share your affiliate link?"
                                            tabIndex={4}
                                            aria-required="true"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                        />
                                    </fieldset>
                                </div>
                                <div className="btn-submit">
                                    <button className="tf-button style-1" type="submit">SUBSCRIBE NOW</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
})
