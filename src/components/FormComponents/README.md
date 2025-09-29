# Componentes de Formulário Refatorados

Este diretório contém componentes reutilizáveis para formulários que foram criados para melhorar a organização e aparência da tela `DataProfile.js`.

## Componentes Disponíveis

### 1. FormField
Componente para campos de texto simples com validação integrada.

**Props:**
- `control`: Control do react-hook-form
- `name`: Nome do campo
- `label`: Label do campo
- `required`: Boolean para indicar se é obrigatório
- `placeholder`: Texto de placeholder
- `keyboardType`: Tipo do teclado
- `maxLength`: Tamanho máximo
- `editable`: Boolean para permitir edição
- `error`: Objeto de erro do react-hook-form
- `style`: Estilos customizados

### 2. FormSelect
Componente para campos de seleção com dropdown.

**Props:**
- `control`: Control do react-hook-form
- `name`: Nome do campo
- `label`: Label do campo
- `required`: Boolean para indicar se é obrigatório
- `placeholder`: Texto de placeholder
- `options`: Array de opções
- `editable`: Boolean para permitir edição
- `error`: Objeto de erro do react-hook-form
- `onValueChange`: Função customizada para mudança de valor

### 3. FormMaskField
Componente para campos com máscara (CPF, telefone, etc.).

**Props:**
- `control`: Control do react-hook-form
- `name`: Nome do campo
- `label`: Label do campo
- `required`: Boolean para indicar se é obrigatório
- `placeholder`: Texto de placeholder
- `mask`: Máscara a ser aplicada
- `options`: Opções adicionais para a máscara
- `keyboardType`: Tipo do teclado
- `editable`: Boolean para permitir edição
- `error`: Objeto de erro do react-hook-form

### 4. FormSection
Componente para agrupar campos em seções com título.

**Props:**
- `title`: Título da seção
- `children`: Componentes filhos
- `showLine`: Boolean para mostrar linha separadora

### 5. ImageUploadSection
Componente para upload de imagens e PDFs com opção de escolha.

**Props:**
- `control`: Control do react-hook-form
- `name`: Nome base do campo
- `label`: Label do campo
- `required`: Boolean para indicar se é obrigatório
- `editPermission`: Boolean para permitir edição
- `setValue`: Função setValue do react-hook-form
- `idImage`: ID para as imagens
- `idPdf`: ID para os PDFs
- `type`: Tipo ('image' ou 'document')

### 6. BankSelector
Componente especializado para seleção de bancos com modal de busca.

**Props:**
- `control`: Control do react-hook-form
- `name`: Nome do campo
- `banksList`: Lista de bancos
- `editPermission`: Boolean para permitir edição
- `setValue`: Função setValue do react-hook-form
- `loading`: Boolean para estado de carregamento

## Melhorias Implementadas

### 1. Organização
- Separação clara entre seções do formulário
- Agrupamento lógico de campos relacionados
- Componentes reutilizáveis

### 2. Visual
- Campos com bordas arredondadas
- Cores consistentes para estados (editável/não editável)
- Feedback visual para erros
- Layout responsivo com campos lado a lado quando apropriado

### 3. UX
- Validação visual melhorada
- Mensagens de erro mais claras
- Campos desabilitados com aparência visual diferente
- Seções com fundo diferenciado para melhor organização

### 4. Manutenibilidade
- Código mais limpo e organizado
- Componentes reutilizáveis
- Props bem documentadas
- Separação de responsabilidades

## Como Usar

```javascript
import {
  FormField,
  FormSelect,
  FormMaskField,
  FormSection,
  ImageUploadSection,
  BankSelector
} from '../../components/FormComponents';

// Exemplo de uso
<FormSection title="DADOS PESSOAIS">
  <FormField
    control={control}
    name="fullName"
    label="Nome completo"
    required
    placeholder="Seu nome aqui"
    editable={permissionToEdit}
    error={errors.fullName}
  />
</FormSection>
```

