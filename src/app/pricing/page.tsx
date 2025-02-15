// app/pricing/page.tsx
import { redirect } from 'next/navigation';

export default function PricingPage() {
    // Якщо хочете одразу перенаправляти користувача на калькулятор:
    redirect('/pricing/calculator');

}
