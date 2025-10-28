import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Invoice, calculateInvoice } from "@/types/invoice";
import { numberToFrenchWords } from "@/lib/numberToWords";
import { Printer } from "lucide-react";
import { Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface InvoicePreviewProps {
  invoice: Invoice;
  logo?: string;
  onClose: () => void;
}

export const InvoicePreview = ({ invoice, logo, onClose }: InvoicePreviewProps) => {
  const calculations = calculateInvoice(invoice);
  const [contactInfo, setContactInfo] = useState({
    address: "Abidjan, Côte d'Ivoire",
    phone: "+225 XX XX XX XX XX",
    email: "contact@mhshs-ci.com"
  });

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    const { data } = await supabase
      .from("contact_info")
      .select("*")
      .maybeSingle();
    
    if (data) {
      setContactInfo({
        address: data.address,
        phone: data.phone,
        email: data.email
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{invoice.type === "invoice" ? "Facture" : "Devis"} - {invoice.number}</span>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div id="invoice-print" className="bg-background p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              {logo ? (
                <img src={logo} alt="Logo" className="h-16 w-auto" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                    <Sun className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <span className="text-2xl font-bold">MHSHS-CI SARL</span>
                </div>
              )}
              <div className="mt-4 text-sm">
                <p className="font-bold">MHSHS-CI SARL</p>
                <p>{contactInfo.address}</p>
                <p>Email: {contactInfo.email}</p>
                <p>Tél: {contactInfo.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold mb-2">
                {invoice.type === "invoice" ? "FACTURE" : "DEVIS"}
              </h1>
              <p className="text-lg font-semibold">{invoice.number}</p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date(invoice.date).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          {/* Client Info */}
          <Card>
            <CardContent className="p-4">
              <p className="font-bold mb-2">Facturé à:</p>
              <p className="font-semibold">{invoice.clientName}</p>
              <p className="text-sm">{invoice.clientAddress}</p>
              <p className="text-sm">Contact: {invoice.clientContact}</p>
            </CardContent>
          </Card>

          {/* Items Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Désignation</TableHead>
                <TableHead className="text-center">Quantité</TableHead>
                <TableHead className="text-right">Prix Unit. HT</TableHead>
                <TableHead className="text-right">Total HT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.designation}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {item.unitPrice.toLocaleString("fr-FR")} FCFA
                  </TableCell>
                  <TableCell className="text-right">
                    {(item.quantity * item.unitPrice).toLocaleString("fr-FR")} FCFA
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-96 space-y-2">
              <div className="flex justify-between">
                <span>Sous-total HT:</span>
                <span className="font-semibold">
                  {calculations.subtotal.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              {invoice.labor > 0 && (
                <div className="flex justify-between">
                  <span>Main d'œuvre:</span>
                  <span className="font-semibold">
                    {calculations.laborAmount.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>Remise ({invoice.discount}%):</span>
                  <span className="font-semibold">
                    -{calculations.discountAmount.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxe TEE (2%):</span>
                <span className="font-semibold">
                  {calculations.teeAmount.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total TTC:</span>
                <span>{calculations.totalTTC.toLocaleString("fr-FR")} FCFA</span>
              </div>
            </div>
          </div>

          {/* Amount in words */}
          <Card className="bg-muted">
            <CardContent className="p-4">
              <p className="font-semibold">
                Arrêtée la {invoice.type === "invoice" ? "facture" : "devis"} à la somme de:
              </p>
              <p className="text-lg capitalize italic">
                {numberToFrenchWords(Math.round(calculations.totalTTC))} francs CFA
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-xs text-muted-foreground text-center border-t pt-4">
            <p>MHSHS-CI SARL - Solutions Solaires en Côte d'Ivoire</p>
            <p>Merci pour votre confiance</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
