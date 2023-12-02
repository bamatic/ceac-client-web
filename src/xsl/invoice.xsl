<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output omit-xml-declaration="yes" indent="yes"/>
    <xsl:strip-space elements="*"/>

    <xsl:template match="/invoice">
        <html>
            <body>
                <table class="table">
                    <thead>
                        <tr>
                            <th>N°</th><th>Date</th><th>Pedido</th><th>Entrega</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><xsl:value-of select="invoicenumber"/></td>
                            <td><xsl:value-of select="invoicedate"/></td>
                            <td><xsl:value-of select="commandname"/></td>
                            <td><xsl:value-of select="deliverydate"/></td>
                        </tr>
                    </tbody>
                </table>
                <div><h2>FACTURE</h2></div>

            </body>
        </html>

    </xsl:template>
</xsl:stylesheet>
