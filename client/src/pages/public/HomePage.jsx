import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MetaTags from '../../SEO/MetaTags.jsx';
import SeoSchema from '../../components/public/SeoSchema.jsx';
import ServiceCard from '../../components/public/ServiceCard.jsx';
import GalleryGrid from '../../components/public/GalleryGrid.jsx';
import ReviewCard from '../../components/public/ReviewCard.jsx';
import WhatsAppButton from '../../components/public/WhatsAppButton.jsx';
import Button from '../../components/common/Button.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import { organizationStructuredData } from '../../SEO/structuredData.js';
import { getServices } from '../../services/services.api.js';
import { getGallery } from '../../services/gallery.api.js';
import { createReview, getReviews } from '../../services/reviews.api.js';
import { unwrapApiData, unwrapApiList } from '../../utils/apiData.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const SectionTitle = ({ eyebrow, title, text }) => (
  <div className="mx-auto max-w-2xl text-center">
    <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b76d86]">{eyebrow}</p>
    <h2 className="mt-3 text-3xl font-black text-[#352633] md:text-5xl">{title}</h2>
    {text ? <p className="mt-4 leading-7 text-[#6f5364]">{text}</p> : null}
  </div>
);

const initialReviewForm = { customerName: '', serviceName: '', rating: '5', comment: '' };

export default function HomePage() {
  const [data, setData] = useState({
    services: [],
    gallery: [],
    reviews: [],
    stats: { averageRating: 0, activeServices: 0 },
    loading: true,
  });
  const [reviewForm, setReviewForm] = useState(initialReviewForm);
  const [reviewImage, setReviewImage] = useState(null);
  const [reviewStatus, setReviewStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      getServices({ active: true, featured: true, limit: 6 }),
      getGallery({ active: true, limit: 6 }),
      getReviews({ approved: true, limit: 100 }),
    ]).then((results) => {
      if (!active) return;
      const servicesPayload = results[0].status === 'fulfilled' ? unwrapApiData(results[0].value) : {};
      const reviewsPayload = results[2].status === 'fulfilled' ? unwrapApiData(results[2].value) : {};

      setData({
        services: results[0].status === 'fulfilled' ? unwrapApiList(results[0].value, 'services') : [],
        gallery: results[1].status === 'fulfilled' ? unwrapApiList(results[1].value, 'galleryItems') : [],
        reviews: results[2].status === 'fulfilled' ? unwrapApiList(results[2].value, 'reviews') : [],
        stats: {
          averageRating: Number(reviewsPayload.averageRating ?? 0),
          activeServices: Number(servicesPayload.activeServices ?? 0),
        },
        loading: false,
      });
    });
    return () => {
      active = false;
    };
  }, []);

  const startingPrice = data.services.length ? Math.min(...data.services.map((service) => service.discountPrice ?? service.price ?? 0)) : 0;
  const averageRating = `${data.stats.averageRating.toFixed(1)}/5.0`;
  const beautyRituals = `${data.stats.activeServices}+`;

  const updateReviewForm = (event) => setReviewForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewStatus({ loading: true, error: '', success: '' });
    const payload = new FormData();
    Object.entries(reviewForm).forEach(([key, value]) => payload.append(key, value));
    if (reviewImage) payload.append('image', reviewImage);

    try {
      await createReview(payload);
      setReviewForm(initialReviewForm);
      setReviewImage(null);
      event.target.reset();
      setReviewStatus({ loading: false, error: '', success: 'Thank you. Your review is pending approval.' });
    } catch (error) {
      setReviewStatus({ loading: false, error: error?.response?.data?.message || 'Unable to submit your review right now.', success: '' });
    }
  };

  return (
    <>
      <MetaTags path="/" />
      <SeoSchema data={organizationStructuredData} />
      <section className="section-shell grid min-h-[calc(100vh-5rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="inline-flex rounded-full border border-[#ead1d9] bg-white/70 px-4 py-2 text-sm font-bold text-[#7d3c58]">
            Premium beauty care at home
          </p>
          <h1 className="mt-6 text-5xl font-black leading-tight text-[#352633] md:text-7xl">
            Salon polish without leaving your home.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#6f5364]">
            Cosmo Home brings trained beauticians, curated products, and calm appointment experiences to your doorstep.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="inline-flex min-h-11 items-center rounded-full bg-[#7d3c58] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#7d3c58]/20" to="/services">
              Explore Services
            </Link>
            <WhatsAppButton>WhatsApp Booking</WhatsAppButton>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {[
              [averageRating, 'Average rating'],
              [beautyRituals, 'Beauty rituals'],
              ['7 days', 'Open weekly'],
            ].map(([value, label]) => (
              <div className="glass-panel rounded-3xl p-4" key={label}>
                <p className="text-2xl font-black text-[#7d3c58]">{value}</p>
                <p className="mt-1 text-xs font-semibold text-[#846071]">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div className="glass-panel rounded-[2rem] p-4" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#f8dfe5]">
            <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80"
              alt="Premium salon service"
            />
          </div>
        </motion.div>
      </section>

      <section className="section-shell py-16">
        <SectionTitle eyebrow="Featured Services" title="Beauty rituals made effortless" text="Browse our most-loved services, priced clearly and delivered professionally." />
        {data.loading ? <Loader /> : null}
        {!data.loading && data.services.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.services.slice(0, 6).map((service) => <ServiceCard key={service._id || service.slug} service={service} compact />)}
          </div>
        ) : null}
      </section>

      <section className="bg-white/60 py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-4">
          {['Verified professionals', 'Doorstep convenience', 'Transparent pricing', 'Hygienic kits'].map((item) => (
            <motion.div className="premium-card rounded-3xl p-6" key={item} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }}>
              <h3 className="text-xl font-black text-[#352633]">{item}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6f5364]">Thoughtfully designed service standards for a calm, polished, and reliable at-home salon experience.</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-shell py-16">
        <SectionTitle eyebrow="Pricing Preview" title={startingPrice ? `Services from ${formatCurrency(startingPrice)}` : 'Clear prices before you book'} text="No surprise add-ons. Choose the service, confirm your slot, and relax." />
      </section>

      {data.reviews.length ? (
        <section className="section-shell py-16">
          <SectionTitle eyebrow="Testimonials" title="Customers trust the Cosmo Home touch" />
          <div className="mt-10 flex gap-6 overflow-x-auto pb-4">
            {data.reviews.map((review) => (
              <div className="w-full shrink-0 md:w-[calc((100%_-_3rem)/3)]" key={review._id || review.id}>
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section-shell py-16">
        <div className="glass-panel grid gap-8 rounded-[2rem] p-6 md:p-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b76d86]">Share Your Experience</p>
            <h2 className="mt-3 text-3xl font-black text-[#352633] md:text-5xl">Leave a Cosmo Home review.</h2>
            <p className="mt-4 leading-7 text-[#6f5364]">Your feedback helps our team improve. Reviews appear publicly after admin approval.</p>
          </div>
          <form onSubmit={submitReview}>
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Name" name="customerName" value={reviewForm.customerName} onChange={updateReviewForm} required minLength={2} />
              <Input label="Rating" name="rating" type="number" min="1" max="5" value={reviewForm.rating} onChange={updateReviewForm} required />
              <Input label="Service Availed" name="serviceName" value={reviewForm.serviceName} onChange={updateReviewForm} required minLength={2} />
              <Textarea label="Review" name="comment" value={reviewForm.comment} onChange={updateReviewForm} required minLength={10} className="md:col-span-2" />
              <FileUpload label="Photo" accept="image/*" helper="Optional" onChange={(event) => setReviewImage(event.target.files?.[0])} className="md:col-span-2" />
            </div>
            {reviewStatus.error ? <p className="mt-4 text-sm font-semibold text-[#b4234d]">{reviewStatus.error}</p> : null}
            {reviewStatus.success ? <p className="mt-4 text-sm font-semibold text-[#237b4b]">{reviewStatus.success}</p> : null}
            <Button className="mt-6 w-full md:w-auto" type="submit" disabled={reviewStatus.loading}>
              {reviewStatus.loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </div>
      </section>

      {data.gallery.length ? (
        <section className="section-shell py-16">
          <SectionTitle eyebrow="Gallery" title="A glimpse of our work" />
          <div className="mt-10">
            <GalleryGrid items={data.gallery.slice(0, 4)} />
          </div>
        </section>
      ) : null}

      <section className="section-shell py-16">
        <div className="glass-panel grid gap-8 rounded-[2rem] p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b76d86]">Join Cosmo Home</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Are you a professional beautician?</h2>
            <p className="mt-4 leading-7 text-[#6f5364]">Apply to partner with a growing home salon brand built around trust, quality, and flexible work.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Link className="inline-flex min-h-11 items-center rounded-full bg-[#7d3c58] px-6 py-3 text-sm font-bold text-white" to="/beautician-apply">
              Apply Now
            </Link>
            <WhatsAppButton message="Hi Cosmo Home, I want to know more about beautician onboarding.">Talk to Us</WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
