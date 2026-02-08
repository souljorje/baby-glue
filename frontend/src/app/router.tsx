import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DemoPage } from '../pages/demo-page';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DemoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
