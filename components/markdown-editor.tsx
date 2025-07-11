"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Eye, Edit } from "lucide-react"
import MarkdownRenderer from "./markdown-renderer"



export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(`# Markdown Renderer

Bu bir **markdown renderer** örneğidir!

## Özellikler

- **Kalın metin** ve *italik metin*
- ~~Üstü çizili metin~~
- \`inline kod\` ve kod blokları
- Linkler ve resimler
- Listeler ve alıntılar

### Kod Örneği

\`\`\`javascript
function merhaba() {
  console.log("Merhaba Dünya!");
}
\`\`\`

### Liste Örneği

1. Birinci madde
2. İkinci madde
3. Üçüncü madde

- Madde A
- Madde B
- Madde C

### Alıntı Örneği

> Bu bir alıntı örneğidir. Markdown ile kolayca alıntı yapabilirsiniz.

### Link Örneği

[GitHub](https://github.com) linkine tıklayabilirsiniz.

---

Bu renderer temel markdown özelliklerini destekler!`)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Markdown Renderer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="split" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="edit">
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </TabsTrigger>
              <TabsTrigger value="split">
                <Eye className="w-4 h-4 mr-2" />
                Bölünmüş
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="w-4 h-4 mr-2" />
                Önizleme
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Markdown Editörü</h3>
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Kopyala
                  </Button>
                </div>
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Markdown metninizi buraya yazın..."
                  className="min-h-[500px] font-mono"
                />
              </div>
            </TabsContent>

            <TabsContent value="split" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Editör</h3>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Kopyala
                    </Button>
                  </div>
                  <Textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="Markdown metninizi buraya yazın..."
                    className="min-h-[500px] font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Önizleme</h3>
                  <div className="border rounded-lg p-4 min-h-[500px] bg-white overflow-auto">
                    <MarkdownRenderer markdown={markdown} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Önizleme</h3>
                <div className="border rounded-lg p-6 bg-white">
                  <MarkdownRenderer markdown={markdown} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
