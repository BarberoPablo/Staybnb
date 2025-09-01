import { Container } from "../components/Container";

export default function Loading() {
  return (
    <Container>
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin w-16 h-16 border-4 border-myGreenSemiBold border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold text-myGrayDark mb-2">Searching listings</h1>
          <p className="text-myGray">Looking for amazing places...</p>
        </div>
      </div>
    </Container>
  );
}
