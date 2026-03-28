# FLEX: Knowledge-Guided Feature Enhancement for Robust Pathology Foundation Models

## Summary

Pathology foundation models, a cornerstone of modern computational pathology, are critically hampered by two significant limitations: **a lack of cross-domain generalization** and **the presence of demographic bias**. These models often learn "site-specific signatures"—superficial patterns arising from variations in lab procedures—instead of true pathological features. This "shortcut learning" results in high accuracy on data from familiar sources (in-domain) but a drastic performance drop and unreliability on data from new clinical sites (out-of-domain), posing a serious risk of misdiagnosis. Furthermore, these models exhibit significant performance disparities across different racial and ancestry groups, compromising diagnostic equity.

**FLEX** is a novel framework designed to address these fundamental challenges. FLEX operates as a flexible, model-agnostic module that enhances the features extracted by pathology Vision-Language Models (VLMs). Its core mechanism employs a **variational information bottleneck**, guided by **expert-verified visual and textual concepts**, to disentangle task-relevant biological information from spurious site-specific and demographic-related signals.

Comprehensive evaluation across **16 distinct pathology tasks** demonstrates that FLEX significantly improves cross-domain generalization, showing marked performance gains in both out-of-domain and zero-shot testing scenarios on external datasets. Crucially, FLEX also enhances demographic fairness by substantially reducing performance gaps across racial and ancestry groups. Its versatility is confirmed through successful integration with multiple state-of-the-art VLMs and downstream Multiple Instance Learning (MIL) architectures.

![FLEX Framework Overview](/projects/flex/fig1.png)

---

## The Core Challenge in Computational Pathology

Despite rapid advancements, the clinical deployment of pathology foundation models is hindered by issues of **generalizability** and **fairness**.

### Site-Specific Signatures and Shortcut Learning

Pathology AI models exhibit a significant performance decline when applied to data from clinical centers not represented in their training set. This issue stems from **site-specific signatures**, which are variations in visual data caused by differences in:

- Tissue sectioning and preparation protocols (e.g., tissue thickness)
- Staining procedures and reagents
- Digital scanning equipment

These signatures encourage **shortcut learning**, where the model learns to associate these superficial, site-specific patterns with diagnostic labels rather than the underlying biological features of the disease.

#### Impact on Performance

This leads to a stark performance gap between in-domain (IND) data from sites seen during training and out-of-domain (OOD) data from unseen sites. A systematic evaluation across 16 pathology tasks revealed a significant drop in Area Under the ROC Curve (AUROC) for OOD data:

| Task Category | Average IND AUROC | Average OOD AUROC | Performance Drop |
|--------------|-------------------|-------------------|------------------|
| Morphology Classification | 0.918 | 0.853 | -7.08% |
| Molecular Biomarker Prediction | 0.754 | 0.721 | -4.38% |
| Gene Mutation Prediction | 0.651 | 0.628 | -3.53% |

### Ineffectiveness of Current Solutions

A common approach to mitigate these issues is **stain normalization**, which aims to align the color distribution of whole-slide images (WSIs). However, analysis shows this method is insufficient for complex biases.

> "While this approach can be effective when domain shift is primarily due to color variation, it is often insufficient for more complex biases. As shown in Fig. 2a (right panel), features after Reinhard normalization remain strongly clustered by site."

Consequently, stain normalization yields "minimal and inconsistent performance gains, and in some cases, even reduced performance."

### Demographic Bias and Fairness

Recent studies have highlighted a "concerning lack of demographic fairness in pathology foundation models." This arises from variations in tissue appearance across demographic groups and imbalances in training data.

- **Performance Disparities**: Baseline models trained on original features exhibit notable performance disparities when cohorts are stratified by both self-reported race and genetic ancestry.
- **Stain Normalization Fails to Address Bias**: Simple stain normalization does not effectively address these deep-seated demographic biases.

---

## The FLEX Framework: A Novel Solution

FLEX is a flexible and adaptable module engineered to enhance the generalization and fairness of pathology AI by addressing the root causes of performance degradation.

### Overview and Objective

The objective of FLEX is to refine the patch-level features extracted by a VLM, **filtering out site-specific signatures and task-agnostic information** while **preserving task-relevant biological signals**. This produces enhanced features (Z) that are more robust for downstream classification by MIL models.

### Core Mechanism: Knowledge-Guided Feature Enhancement

FLEX disentangles features using a **variational information bottleneck**, which compresses the feature representation to discard irrelevant information. This process is guided by two forms of pre-computed, expert-verified prior knowledge.

#### Visual and Textual Concept Generation

**1. Visual Concepts**: Representative patch images for each diagnostic class are identified through a multi-step process:

- An ABMIL model identifies high-attention patches
- A multimodal large language model (GPT-4o) filters these patches for task relevance
- A human expert pathologist provides final verification
- The features of these verified patches are averaged to create a class-specific "visual concept"

**2. Textual Concepts**: Clinically accurate text prompts are generated to serve as supervision signals:

- Prompts include task-specific labels (e.g., "invasive ductal carcinoma") and task-agnostic descriptions (e.g., "connective tissue")
- GPT-4o can assist in drafting prompts, but all final prompts are reviewed, edited, and approved by a board-certified pathologist
- These prompts are enriched with learnable contexts that adaptively capture task-specific information during training
- The VLM's text encoder converts these prompts into "textual concepts"

#### Knowledge-Guided Training Process

During training, FLEX uses these concepts to provide more accurate patch-level supervision signals than are available in standard weakly-supervised MIL pipelines.

**1. Visual Concept-Guided Pilot Patch Selection**: The visual concepts are used to identify the most task-relevant "pilot patches" within a WSI by calculating cosine similarity.

**2. Textual Concept-Guided Feature Calibration**: An InfoNCE contrastive loss function is used to optimize the feature enhancement. It forces the enhanced features of the pilot patches to become:

- Closer to their corresponding task-specific textual concept (positive supervision)
- Further from other task-specific and all task-agnostic textual concepts (negative supervision)

Because the textual concepts are "inherently free of site or demographic information," this process compels the model to discard those spurious signals.

---

## Empirical Validation and Key Findings

FLEX was extensively evaluated across 16 tasks, 4 cancer types, multiple datasets, and various model architectures, demonstrating consistent and significant improvements in generalization and fairness.

### Improved Cross-Domain Generalization

FLEX consistently improves model performance on unseen data from new clinical sites.

#### TCGA OOD Performance

In the rigorous Site-Preserved Monte Carlo Cross-Validation (SP-MCCV) setup, FLEX significantly boosted OOD performance. For the STAD LAUREN task, it achieved a **15.13% increase in OOD AUROC**, reducing the IND-OOD performance gap from 20.59% to 8.64%.

#### Zero-Shot External Validation

Models trained exclusively on TCGA data and then applied to the external CPTAC and in-house NFH cohorts without fine-tuning showed substantial performance gains with FLEX:

- **CPTAC Cohort**: Average AUROC increased from 0.679 to 0.714 (p < 0.001)
- **NFH Cohort**: Average AUROC increased from 0.733 to 0.771 (p < 0.001)

#### Qualitative Analysis

Visualizations of model attention maps reveal the mechanism behind these gains. For a BRCA-TYPE classification, the baseline model's attention was "diffuse, scattered across tumor cells and distracting noisy elements." In contrast, the FLEX-enhanced model "consistently focuses on critical, task-relevant features like the irregular glandular and ductal formations characteristic of Invasive Ductal Carcinoma (IDC)."

### Enhanced Demographic Fairness

FLEX significantly reduces performance disparities across demographic groups stratified by race and genetic ancestry.

#### Reduced Fairness Gap

FLEX consistently reduces the AUC gap ratio (performance difference between best- and worst-performing groups). For the NSCLC-TYPE task, the mean fairness gap for race was reduced from 0.052 to 0.041.

#### Equitable True Positive Rate (TPR)

FLEX makes diagnostic capability more equitable. Violin plots of TPR disparity are "consistently narrower and more centered around the zero-disparity line." This is supported by quantitative metrics; for the challenging C-LUAD-EGFR task, FLEX reduced the average TPR disparity RMSE from 0.140 to 0.085.

#### Consistent Race-Wise Performance

Race-wise AUROC distributions show that FLEX yields "tighter and more equitable performance clusters," indicating that its diagnostic power is not significantly influenced by demographic factors.

### Demonstrated Versatility and Scalability

The benefits of FLEX are not limited to a single model or setup; it is a broadly applicable solution.

#### VLM Agnosticism

FLEX was integrated with three different pathology VLMs (CONCH, PathGen-CLIP, QuiltNet) and delivered robust performance improvements in nearly all scenarios across 16 tasks.

#### MIL Model Compatibility

When integrated with five state-of-the-art MIL architectures (ABMIL, CLAM-SB, ACMIL, DTFD-MIL, ILRA-MIL), FLEX consistently improved OOD performance, with average gains ranging from 3.53% to 6.06%.

#### Scalability with Data Size

Experiments on the BRCA cohort with increasing training data sizes (from 1 to 4 folds) showed that FLEX "consistently and significantly (q < 0.05) improves OOD performance across all tasks and data scales."

#### Feature Space Improvement

UMAP visualizations of the patch feature space confirm that after applying FLEX, site-specific clusters dissolve, and separation between diagnostic classes improves. This is quantitatively validated by a significant increase in the Local Inverse Simpson's Index (LISI) score (measuring site integration) and the Silhouette Score (measuring class separation).

---

## Methodology and Experimental Design

The study's conclusions are supported by a rigorous experimental design and a comprehensive set of tasks and datasets.

### Datasets and Tasks

- **Primary Training/Testing Cohort**: The Cancer Genome Atlas (TCGA), including data from breast (BRCA), non-small cell lung (NSCLC), stomach (STAD), and colorectal (CRC) cancer
- **External Validation Cohorts**: The Clinical Proteomic Tumor Analysis Consortium (CPTAC) and a large in-house dataset from Nanfang Hospital (NFH), used for zero-shot generalization testing
- **WSI Analysis Tasks**: A total of 16 classification tasks spanning three main categories:

| Category | Task Examples |
|----------|---------------|
| Morphology Classification (3 tasks) | BRCA-TYPE (IDC vs. ILC), NSCLC-TYPE (LUAD vs. LUSC) |
| Molecular Biomarker Prediction (5 tasks) | BRCA-HER2 (Positive vs. Negative), STAD-MSI (MSI-H vs. Non MSI-H) |
| Gene Mutation Prediction (8 tasks) | LUAD-EGFR (WT vs. MUT), CRC-BRAF (WT vs. MUT) |

### Evaluation Protocol: SP-MCCV

To ensure a stringent and realistic assessment of generalization, a **Site-Preserved Monte Carlo Cross-Validation (SP-MCCV)** strategy was implemented:

1. **Outer Loop (Site-Preserved)**: The dataset is partitioned into folds based on the Tissue Source Site (TSS), ensuring that all data from a given hospital or institution is in the same fold
2. **Training and OOD Testing**: In each iteration, one site-fold is held out as the OOD test set, while the remaining folds are used for training. This simulates deployment to a completely new clinical environment
3. **Inner Loop (IND Testing)**: The training data (comprised of seen sites) is further split to create an IND test set for performance comparison

This nested procedure "guarantees that model training and validation occur on data originating from distinct, site-specific distributions."

---

## Discussion and Future Directions

FLEX represents a significant advancement in adapting foundation models for computational pathology by strategically using multimodal prior knowledge.

### Key Insight

By leveraging textual concepts that are inherently free of confounding information, FLEX forces the model to discard spurious site and demographic signals through an information bottleneck, leading to more robust and equitable performance.

### Limitations

- **Dependence on VLMs**: The current architecture relies on the aligned visual and textual embedding spaces of pathology VLMs, limiting its use with vision-only foundation models
- **Task Specificity**: FLEX is primarily optimized for classification tasks

### Future Directions

- **Broader Compatibility**: Exploring cross-modal distillation or developing a vision-only adaptation module to generalize FLEX to a wider range of model architectures
- **Expanded Applications**: Extending the framework to support regression and prognosis tasks, which are crucial for personalized medicine. This could involve incorporating prognostic-specific textual prompts
- **Enhanced Interpretability**: Pursuing quantitative validation of the model's attention mechanisms against expert pathologist annotations to objectively confirm the model's focus on clinically relevant regions

---

## Citation

If you use FLEX in your research, please cite:

```bibtex
@article{huang2025flex,
  title={Knowledge-guided feature enhancement for robust pathology foundation models},
  author={Huang, Yanyan and others},
  journal={Nature Communications},
  year={2025},
  month={December},
  url={https://www.nature.com/ncomms/}
}
```

## Code Availability

The implementation of FLEX is available at: [https://github.com/HKU-MedAI/FLEX](https://github.com/HKU-MedAI/FLEX)

