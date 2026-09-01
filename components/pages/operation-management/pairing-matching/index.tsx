import InitialPage from "./pairing-matching-initial-page";

interface PairingMatchingProps {
  children: React.ReactNode;
}

const PairingMatching = ({ children }: PairingMatchingProps) => ({
  children,
});

PairingMatching.InitialPage = InitialPage;

export default PairingMatching;
